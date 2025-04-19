import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBookingSchema, insertGallerySchema, insertServiceSchema, insertTestimonialSchema, users } from "@shared/schema";
import { processReminderBatch, scheduleReminderCheck } from "./reminder";
import { 
  sendBookingConfirmationEmail, 
  sendBookingNotificationEmail,
  sendBookingCancellationEmail
} from "./mailer";
import Stripe from "stripe";
import { verifySupabaseSession, getUserBySupabaseId } from "./supabase";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe API key: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
});

// Check if user is authenticated and is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  setupAuth(app);
  
  // Schedule the email reminder system to run automatically
  console.log('Starting email reminder service for KARI STYLEZ...');
  scheduleReminderCheck();
  
  // Admin setup endpoint - make a user an admin
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { email, supabaseToken } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      
      // Verify the Supabase token if provided
      if (supabaseToken) {
        const session = await verifySupabaseSession(supabaseToken);
        if (!session) {
          return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }
      }
      
      // Find the user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create a user if it doesn't exist with admin role
        // We need to make a raw query to include the role field
        // We'll use pool.query instead of db.execute for simpler execution
        const result = await pool.query(
          `INSERT INTO users (username, email, password, role) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, email, role`,
          [email.split('@')[0], email, Math.random().toString(36).slice(-10), 'admin']
        );
        
        if (result.rows[0]) {
          return res.status(201).json({ 
            success: true, 
            message: "Admin user created successfully", 
            user: result.rows[0]
          });
        } else {
          return res.status(500).json({ success: false, message: "Failed to create user" });
        }
      }
      
      // Update existing user to admin role
      const result = await pool.query(
        `UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email, role`, 
        [email]
      );
      
      if (result.rows[0]) {
        return res.json({ 
          success: true, 
          message: "User promoted to admin successfully", 
          user: result.rows[0]
        });
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ success: false, message: "Server error setting up admin user" });
    }
  });
  
  // Payment routes
  app.post("/api/create-payment-intent", async (req, res, next) => {
    try {
      const { amount, serviceType, customerEmail, bookingId } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: `Deposit for ${serviceType || 'hair service'}`,
        receipt_email: customerEmail,
        metadata: {
          bookingId: bookingId ? bookingId.toString() : '',
          serviceType: serviceType || '',
        },
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update booking payment status
  app.post("/api/update-booking-payment", async (req, res, next) => {
    try {
      const { bookingId, depositPaid } = req.body;
      
      if (!bookingId || typeof depositPaid !== 'boolean') {
        return res.status(400).json({ message: 'Invalid request data' });
      }
      
      const booking = await storage.updateBookingDeposit(bookingId, depositPaid);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.status(200).json(booking);
    } catch (error: any) {
      console.error('Error updating booking payment status:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Client routes
  app.get("/api/client/bookings", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Get bookings associated with this user's email
      const bookings = await storage.getBookings();
      const userBookings = bookings.filter(booking => 
        booking.email === req.user.email
      );
      
      res.json(userBookings);
    } catch (error) {
      next(error);
    }
  });
  
  // Cancel a booking (client-side)
  app.post("/api/client/bookings/:id/cancel", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const bookingId = parseInt(req.params.id);
      
      // Verify this booking belongs to the authenticated user
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.email !== req.user.email) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      // Check if booking is in the future
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      const now = new Date();
      
      if (bookingDate < now) {
        return res.status(400).json({ message: 'Cannot cancel past appointments' });
      }
      
      // Cancel the booking
      const updatedBooking = await storage.updateBookingStatus(bookingId, 'cancelled');
      
      if (!updatedBooking) {
        return res.status(500).json({ message: 'Failed to cancel booking' });
      }
      
      // Send cancellation email notification
      try {
        await sendBookingCancellationEmail(updatedBooking);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // Continue with the response even if email fails
      }
      
      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res, next) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        notes: req.body.notes || null // Ensure notes is never undefined
      });
      const booking = await storage.createBooking(bookingData);
      
      // Send confirmation and notification emails
      try {
        // Send confirmation to client
        await sendBookingConfirmationEmail(booking);
        
        // Send notification to salon
        await sendBookingNotificationEmail(booking);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // We don't want to fail the booking if email sending fails
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid booking data', errors: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/bookings", isAdmin, async (req, res, next) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/bookings/:id/status", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Send appropriate email notification based on status change
      try {
        if (status === 'confirmed') {
          await sendBookingConfirmationEmail(booking);
        } else if (status === 'cancelled') {
          await sendBookingCancellationEmail(booking);
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Continue with the response even if email fails
      }
      
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/bookings/:id/deposit", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { depositPaid } = req.body;
      
      if (typeof depositPaid !== 'boolean') {
        return res.status(400).json({ message: 'Invalid deposit status' });
      }
      
      const booking = await storage.updateBookingDeposit(id, depositPaid);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res, next) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/gallery", isAdmin, async (req, res, next) => {
    try {
      const galleryData = insertGallerySchema.parse({
        ...req.body,
        description: req.body.description || null, // Ensure description is never undefined
        order: req.body.order || null // Ensure order is never undefined
      });
      const galleryItem = await storage.createGalleryItem(galleryData);
      res.status(201).json(galleryItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid gallery data', errors: error.errors });
      }
      next(error);
    }
  });

  app.patch("/api/gallery/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const galleryItem = await storage.updateGalleryItem(id, req.body);
      
      if (!galleryItem) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      
      res.json(galleryItem);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/gallery/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Service routes
  app.get("/api/services", async (req, res, next) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/services", isAdmin, async (req, res, next) => {
    try {
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        icon: req.body.icon || null // Ensure icon is never undefined
      });
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid service data', errors: error.errors });
      }
      next(error);
    }
  });

  app.patch("/api/services/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateService(id, req.body);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/services/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res, next) => {
    try {
      const testimonials = req.query.active === 'true' 
        ? await storage.getActiveTestimonials()
        : await storage.getTestimonials();
      
      res.json(testimonials);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/testimonials", isAdmin, async (req, res, next) => {
    try {
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        imageUrl: req.body.imageUrl || null, // Ensure imageUrl is never undefined
        rating: req.body.rating || null // Ensure rating is never undefined
      });
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid testimonial data', errors: error.errors });
      }
      next(error);
    }
  });

  app.patch("/api/testimonials/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateTestimonial(id, req.body);
      
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      res.json(testimonial);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/testimonials/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
  
  // Business Hours routes
  app.get("/api/business-hours", async (req, res, next) => {
    try {
      const hours = await storage.getBusinessHours();
      res.json(hours);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/business-hours/:day", async (req, res, next) => {
    try {
      const dayOfWeek = parseInt(req.params.day);
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ message: 'Invalid day of week (0-6)' });
      }
      
      const hours = await storage.getBusinessHoursByDay(dayOfWeek);
      if (!hours) {
        return res.status(404).json({ message: 'Business hours not found for this day' });
      }
      
      res.json(hours);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/business-hours", isAdmin, async (req, res, next) => {
    try {
      const hours = await storage.createBusinessHours(req.body);
      res.status(201).json(hours);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/business-hours/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const hours = await storage.updateBusinessHours(id, req.body);
      
      if (!hours) {
        return res.status(404).json({ message: 'Business hours not found' });
      }
      
      res.json(hours);
    } catch (error) {
      next(error);
    }
  });

  // Special dates routes (holidays, special hours, etc)
  app.get("/api/special-dates", async (req, res, next) => {
    try {
      const specialDates = await storage.getSpecialDates();
      res.json(specialDates);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/special-dates/:date", async (req, res, next) => {
    try {
      const date = req.params.date;
      const specialDate = await storage.getSpecialDate(date);
      
      if (!specialDate) {
        return res.status(404).json({ message: 'Special date not found' });
      }
      
      res.json(specialDate);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/special-dates", isAdmin, async (req, res, next) => {
    try {
      const specialDate = await storage.createSpecialDate(req.body);
      res.status(201).json(specialDate);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/special-dates/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const specialDate = await storage.updateSpecialDate(id, req.body);
      
      if (!specialDate) {
        return res.status(404).json({ message: 'Special date not found' });
      }
      
      res.json(specialDate);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/special-dates/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSpecialDate(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Stylist routes
  app.get("/api/stylists", async (req, res, next) => {
    try {
      const stylists = req.query.active === 'true'
        ? await storage.getActiveStylists()
        : await storage.getStylists();
      
      res.json(stylists);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/stylists/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const stylist = await storage.getStylist(id);
      
      if (!stylist) {
        return res.status(404).json({ message: 'Stylist not found' });
      }
      
      res.json(stylist);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stylists", isAdmin, async (req, res, next) => {
    try {
      const stylist = await storage.createStylist(req.body);
      res.status(201).json(stylist);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/stylists/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const stylist = await storage.updateStylist(id, req.body);
      
      if (!stylist) {
        return res.status(404).json({ message: 'Stylist not found' });
      }
      
      res.json(stylist);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/stylists/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStylist(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Calendar related routes
  app.get("/api/calendar/events", async (req, res, next) => {
    try {
      const events = await storage.getBookingsAsCalendarEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bookings/date-range", async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
        return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
      }
      
      const bookings = await storage.getBookingsByDateRange(startDate, endDate);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/available-slots", async (req, res, next) => {
    try {
      const { date, serviceId } = req.query;
      
      if (!date || !serviceId || typeof date !== 'string' || isNaN(Number(serviceId))) {
        return res.status(400).json({ 
          message: 'date and serviceId query parameters are required' 
        });
      }
      
      const timeSlots = await storage.getAvailableTimeSlots(date, Number(serviceId));
      res.json(timeSlots);
    } catch (error) {
      next(error);
    }
  });

  // Appointment reminder routes
  app.post("/api/admin/reminders/send", isAdmin, async (req, res, next) => {
    try {
      const remindersSent = await processReminderBatch();
      res.json({ success: true, remindersSent });
    } catch (error) {
      next(error);
    }
  });
  
  // This would normally be triggered by a cron job
  app.post("/api/admin/reminders/schedule", isAdmin, async (req, res, next) => {
    try {
      // Start the reminder check process
      scheduleReminderCheck();
      res.json({ success: true, message: "Reminder check scheduled" });
    } catch (error) {
      next(error);
    }
  });

  // ==================== STRIPE PAYMENT ENDPOINTS ====================
  
  // Create payment intent for booking deposit
  app.post("/api/create-payment-intent", async (req, res, next) => {
    try {
      const { amount, serviceType, customerEmail, bookingId } = req.body;
      
      if (!amount || !serviceType) {
        return res.status(400).json({ message: 'Amount and service type are required' });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        receipt_email: customerEmail,
        metadata: {
          serviceType,
          bookingId: bookingId ? bookingId.toString() : '',
          paymentType: 'deposit'
        }
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      next(error);
    }
  });
  
  // Webhook handler for Stripe events
  app.post("/api/webhook/stripe", async (req, res, next) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      if (endpointSecret) {
        // Verify webhook signature and extract the event
        event = stripe.webhooks.constructEvent(
          req.body, 
          sig, 
          endpointSecret
        );
      } else {
        // If no signature verification is needed (e.g. for testing)
        event = req.body;
      }
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Extract metadata
      const { bookingId } = paymentIntent.metadata;
      
      if (bookingId) {
        try {
          // Update booking to reflect the paid deposit
          await storage.updateBookingDeposit(parseInt(bookingId), true);
          
          // Get the updated booking
          const booking = await storage.getBooking(parseInt(bookingId));
          
          // Send confirmation emails
          if (booking) {
            await sendBookingConfirmationEmail(booking);
            await sendBookingNotificationEmail(booking);
          }
        } catch (error) {
          console.error('Error updating booking after payment:', error);
        }
      }
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  });
  
  app.post("/api/update-booking-payment", async (req, res, next) => {
    try {
      const { bookingId, depositPaid } = req.body;
      
      if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
      }
      
      const booking = await storage.updateBookingDeposit(parseInt(bookingId), depositPaid);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });

  // Supabase Auth Routes
  // Verify a Supabase JWT token and return user information
  app.get("/api/supabase/auth", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No valid authorization token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      const user = await verifySupabaseSession(token);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      // Return the user data
      res.json({ user });
    } catch (error) {
      console.error('Error verifying Supabase token:', error);
      res.status(500).json({ message: 'Authentication error' });
    }
  });

  // Get user profile by Supabase ID
  app.get("/api/supabase/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No valid authorization token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      const user = await verifySupabaseSession(token);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      // Get additional profile data if needed
      const profile = await getUserBySupabaseId(user.id);
      
      // Combine auth user and profile data
      res.json({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'customer',
        ...profile
      });
    } catch (error) {
      console.error('Error fetching Supabase profile:', error);
      res.status(500).json({ message: 'Profile fetch error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
