import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBookingSchema, insertGallerySchema, insertServiceSchema, insertTestimonialSchema } from "@shared/schema";
import { processReminderBatch, scheduleReminderCheck } from "./reminder";
import { 
  sendBookingConfirmationEmail, 
  sendBookingNotificationEmail,
  sendBookingCancellationEmail
} from "./mailer";

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
      const bookingData = insertBookingSchema.parse(req.body);
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
      const galleryData = insertGallerySchema.parse(req.body);
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
      const serviceData = insertServiceSchema.parse(req.body);
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
      const testimonialData = insertTestimonialSchema.parse(req.body);
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

  const httpServer = createServer(app);
  return httpServer;
}
