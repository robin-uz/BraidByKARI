import { 
  users, bookings, gallery, services, testimonials, 
  businessHours, specialDates, stylists,
  User, Booking, Gallery, Service, Testimonial, 
  BusinessHours, SpecialDate, Stylist, 
  InsertUser,
  CalendarEvent, TimeSlot
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: Omit<Booking, "id" | "status" | "depositPaid" | "createdAt">): Promise<Booking>;
  updateBookingStatus(id: number, status: "pending" | "confirmed" | "cancelled"): Promise<Booking | undefined>;
  updateBookingDeposit(id: number, depositPaid: boolean): Promise<Booking | undefined>;

  // Gallery operations
  getGalleryItems(): Promise<Gallery[]>;
  createGalleryItem(item: Omit<Gallery, "id">): Promise<Gallery>;
  updateGalleryItem(id: number, item: Partial<Omit<Gallery, "id">>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;

  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: Omit<Service, "id">): Promise<Service>;
  updateService(id: number, service: Partial<Omit<Service, "id">>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: Omit<Testimonial, "id" | "isActive">): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<Omit<Testimonial, "id">>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(bookingData: Omit<Booking, "id" | "status" | "depositPaid" | "createdAt">): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  async updateBookingStatus(id: number, status: "pending" | "confirmed" | "cancelled"): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async updateBookingDeposit(id: number, depositPaid: boolean): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ depositPaid })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Gallery operations
  async getGalleryItems(): Promise<Gallery[]> {
    return await db.select().from(gallery).orderBy(gallery.order);
  }

  async createGalleryItem(itemData: Omit<Gallery, "id">): Promise<Gallery> {
    const [item] = await db.insert(gallery).values(itemData).returning();
    return item;
  }

  async updateGalleryItem(id: number, itemData: Partial<Omit<Gallery, "id">>): Promise<Gallery | undefined> {
    const [item] = await db
      .update(gallery)
      .set(itemData)
      .where(eq(gallery.id, id))
      .returning();
    return item;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(gallery).where(eq(gallery.id, id));
    return true;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(serviceData: Omit<Service, "id">): Promise<Service> {
    const [service] = await db.insert(services).values(serviceData).returning();
    return service;
  }

  async updateService(id: number, serviceData: Partial<Omit<Service, "id">>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async createTestimonial(testimonialData: Omit<Testimonial, "id" | "isActive">): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values({ ...testimonialData, isActive: true }).returning();
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialData: Partial<Omit<Testimonial, "id">>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(testimonialData)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
