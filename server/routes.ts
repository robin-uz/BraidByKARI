import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import nodemailer from 'nodemailer';
import { insertBookingSchema, insertGallerySchema, insertServiceSchema, insertTestimonialSchema } from "@shared/schema";
import { processReminderBatch, scheduleReminderCheck } from "./reminder";

// Email configuration
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
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

  // Booking routes
  app.post("/api/bookings", async (req, res, next) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Send confirmation email
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
          await gmailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: 'Booking Confirmation - Divine Braids',
            html: `
              <h1>Thank you for booking with Divine Braids!</h1>
              <p>Dear ${booking.name},</p>
              <p>We have received your booking request for ${booking.serviceType} on ${booking.date} at ${booking.time}.</p>
              <p>Your booking is currently <strong>pending</strong>. We will confirm your appointment shortly.</p>
              <p>If you have any questions, please contact us.</p>
              <p>Best regards,</p>
              <p>Divine Braids Team</p>
            `
          });
          
          // Also send notification to admin
          await gmailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: 'New Booking - Divine Braids',
            html: `
              <h1>New Booking Request</h1>
              <p>Client: ${booking.name}</p>
              <p>Email: ${booking.email}</p>
              <p>Phone: ${booking.phone}</p>
              <p>Service: ${booking.serviceType}</p>
              <p>Date: ${booking.date}</p>
              <p>Time: ${booking.time}</p>
              <p>Notes: ${booking.notes || 'N/A'}</p>
              <p>Please login to the admin dashboard to confirm this booking.</p>
            `
          });
        } catch (error) {
          console.error('Email sending failed:', error);
          // We don't want to fail the booking if email sending fails
        }
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
      
      // Send email notification about status change
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
          await gmailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - Divine Braids`,
            html: `
              <h1>Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
              <p>Dear ${booking.name},</p>
              <p>Your booking for ${booking.serviceType} on ${booking.date} at ${booking.time} has been <strong>${status}</strong>.</p>
              ${status === 'confirmed' ? 
                `<p>We look forward to seeing you!</p>` : 
                status === 'cancelled' ? 
                `<p>If you have any questions about the cancellation, please contact us.</p>` : 
                ''}
              <p>Best regards,</p>
              <p>Divine Braids Team</p>
            `
          });
        } catch (error) {
          console.error('Email sending failed:', error);
        }
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
