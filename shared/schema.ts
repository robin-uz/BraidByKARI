import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("customer").notNull(),
});

export const statusEnum = pgEnum("status", ["pending", "confirmed", "cancelled"]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  notes: text("notes"),
  status: statusEnum("status").default("pending").notNull(),
  depositPaid: boolean("deposit_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  icon: text("icon"),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  testimonial: text("testimonial").notNull(),
  rating: integer("rating").default(5),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

// Business hours for each day of the week
export const businessHours = pgTable("business_hours", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean("is_open").default(true),
  openTime: text("open_time").notNull().default("09:00"), // 24-hour format
  closeTime: text("close_time").notNull().default("17:00"), // 24-hour format
  breakStart: text("break_start"), // Optional break time
  breakEnd: text("break_end"),
});

// Special dates (holidays, special events, etc.)
export const specialDates = pgTable("special_dates", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD format
  isOpen: boolean("is_open").default(false),
  name: text("name").notNull(), // e.g., "Christmas", "Staff Training"
  openTime: text("open_time"), // If different from regular hours
  closeTime: text("close_time"),
});

// Salon Stylist information
export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialties: text("specialties").array(), // Array of service types they specialize in
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  availability: jsonb("availability"), // Store custom availability if different from business hours
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  name: true,
  email: true,
  phone: true,
  serviceType: true,
  date: true,
  time: true,
  notes: true,
});

export const insertGallerySchema = createInsertSchema(gallery).pick({
  title: true,
  description: true,
  imageUrl: true,
  order: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  duration: true,
  icon: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  testimonial: true,
  rating: true,
  imageUrl: true,
});

export const insertBusinessHoursSchema = createInsertSchema(businessHours).pick({
  dayOfWeek: true,
  isOpen: true,
  openTime: true,
  closeTime: true,
  breakStart: true,
  breakEnd: true,
});

export const insertSpecialDateSchema = createInsertSchema(specialDates).pick({
  date: true,
  isOpen: true,
  name: true,
  openTime: true,
  closeTime: true,
});

export const insertStylistSchema = createInsertSchema(stylists).pick({
  name: true,
  specialties: true,
  imageUrl: true,
  isActive: true,
  availability: true,
});

// Extend booking schema with validation
export const bookingFormSchema = insertBookingSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  date: z.string(),
  time: z.string(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Gallery = typeof gallery.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type BusinessHours = typeof businessHours.$inferSelect;
export type SpecialDate = typeof specialDates.$inferSelect;
export type Stylist = typeof stylists.$inferSelect;
export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Custom interface for calendar events
export interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  status?: 'pending' | 'confirmed' | 'cancelled';
  resourceId?: number | string; // For stylist ID if using resources view
  allDay?: boolean;
}

// Interface for time slot
export interface TimeSlot {
  time: string;
  available: boolean;
}
