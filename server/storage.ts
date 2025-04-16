import { 
  users, bookings, gallery, services, testimonials, 
  businessHours, specialDates, stylists,
  User, Booking, Gallery, Service, Testimonial, 
  BusinessHours, SpecialDate, Stylist, 
  InsertUser,
  CalendarEvent, TimeSlot
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, between } from "drizzle-orm";
import { format, addMinutes, parse, isEqual } from "date-fns";
import expressSession from "express-session";
import pgConnect from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = pgConnect(expressSession);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]>;
  createBooking(booking: Omit<Booking, "id" | "status" | "depositPaid" | "createdAt">): Promise<Booking>;
  updateBookingStatus(id: number, status: "pending" | "confirmed" | "cancelled"): Promise<Booking | undefined>;
  updateBookingDeposit(id: number, depositPaid: boolean): Promise<Booking | undefined>;
  
  // Calendar events
  getBookingsAsCalendarEvents(): Promise<CalendarEvent[]>;
  getAvailableTimeSlots(date: string, serviceId: number): Promise<TimeSlot[]>;

  // Business Hours operations
  getBusinessHours(): Promise<BusinessHours[]>;
  getBusinessHoursByDay(dayOfWeek: number): Promise<BusinessHours | undefined>;
  createBusinessHours(hours: Omit<BusinessHours, "id">): Promise<BusinessHours>;
  updateBusinessHours(id: number, hours: Partial<Omit<BusinessHours, "id">>): Promise<BusinessHours | undefined>;
  
  // Special Dates operations
  getSpecialDates(): Promise<SpecialDate[]>;
  getSpecialDate(date: string): Promise<SpecialDate | undefined>;
  createSpecialDate(specialDate: Omit<SpecialDate, "id">): Promise<SpecialDate>;
  updateSpecialDate(id: number, specialDate: Partial<Omit<SpecialDate, "id">>): Promise<SpecialDate | undefined>;
  deleteSpecialDate(id: number): Promise<boolean>;
  
  // Stylist operations
  getStylists(): Promise<Stylist[]>;
  getActiveStylists(): Promise<Stylist[]>;
  getStylist(id: number): Promise<Stylist | undefined>;
  createStylist(stylist: Omit<Stylist, "id">): Promise<Stylist>;
  updateStylist(id: number, stylist: Partial<Omit<Stylist, "id">>): Promise<Stylist | undefined>;
  deleteStylist(id: number): Promise<boolean>;

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
  sessionStore: expressSession.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: expressSession.Store;

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

  async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.date, startDate),
          lte(bookings.date, endDate)
        )
      )
      .orderBy(bookings.date, bookings.time);
  }

  async getBookingsAsCalendarEvents(): Promise<CalendarEvent[]> {
    const bookingsList = await this.getBookings();
    const servicesList = await this.getServices();
    
    const calendarEvents: CalendarEvent[] = bookingsList.map(booking => {
      // Get the service to determine duration
      const service = servicesList.find((s: Service) => s.name === booking.serviceType);
      // Default to 1 hour if service not found or duration not specified
      const durationInMinutes = service ? 
        parseInt(service.duration.split(' ')[0]) || 60 : 60;
      
      // Parse date and time strings to create start and end Date objects
      const dateStr = booking.date; // Assuming format YYYY-MM-DD
      const timeStr = booking.time; // Assuming format HH:MM
      
      const startDate = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDate = addMinutes(startDate, durationInMinutes);
      
      return {
        id: booking.id,
        title: `${booking.name} - ${booking.serviceType}`,
        start: startDate,
        end: endDate,
        status: booking.status,
      };
    });
    
    return calendarEvents;
  }

  async getAvailableTimeSlots(date: string, serviceId: number): Promise<TimeSlot[]> {
    // 1. Get the day of week from the date (0 = Sunday, 1 = Monday, etc.)
    const dayDate = new Date(date);
    const dayOfWeek = dayDate.getDay();
    
    // 2. Check if this date is a special date (holiday, etc.)
    const specialDate = await this.getSpecialDate(date);
    if (specialDate && !specialDate.isOpen) {
      // This is a closed day (holiday, etc.)
      return [];
    }
    
    // 3. Get the business hours for this day
    const dayBusinessHours = await this.getBusinessHoursByDay(dayOfWeek);
    if (!dayBusinessHours || !dayBusinessHours.isOpen) {
      // Salon is closed on this day
      return [];
    }
    
    // 4. Get the requested service
    const service = await this.getService(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Get duration in minutes
    const durationInMinutes = parseInt(service.duration.split(' ')[0]) || 60;
    
    // 5. Get all bookings for this date
    const dateBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.date, date),
          eq(bookings.status, "confirmed")
        )
      )
      .orderBy(bookings.time);
    
    // 6. Generate time slots based on business hours
    // Opening hours (from business hours or special date if different)
    const openTime = specialDate?.openTime || dayBusinessHours.openTime;
    const closeTime = specialDate?.closeTime || dayBusinessHours.closeTime;
    
    // Parse times
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    const startTime = new Date(dayDate);
    startTime.setHours(openHour, openMinute, 0, 0);
    
    const endTime = new Date(dayDate);
    endTime.setHours(closeHour, closeMinute, 0, 0);
    
    // Generate time slots in 30-minute increments
    const timeSlots: TimeSlot[] = [];
    const slotInterval = 30; // minutes
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      // Check if this slot works with service duration
      const slotEndTime = new Date(currentTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + durationInMinutes);
      
      // Skip if the service would end after closing time
      if (slotEndTime > endTime) {
        break;
      }
      
      // Format the time for display
      const timeSlotStr = format(currentTime, 'HH:mm');
      
      // Check if this slot conflicts with any existing bookings
      let isAvailable = true;
      
      // Get all services for duration calculations
      const allServices = await this.getServices();
      
      for (const booking of dateBookings) {
        const bookingStartTime = parse(`${date} ${booking.time}`, 'yyyy-MM-dd HH:mm', new Date());
        
        // Find the corresponding service to determine duration
        const bookingService = allServices.find((s: Service) => s.name === booking.serviceType);
        const bookingDuration = bookingService 
          ? parseInt(bookingService.duration.split(' ')[0]) || 60 
          : 60;
        
        const bookingEndTime = addMinutes(bookingStartTime, bookingDuration);
        
        // Check if there's an overlap
        if (
          (currentTime >= bookingStartTime && currentTime < bookingEndTime) ||
          (slotEndTime > bookingStartTime && slotEndTime <= bookingEndTime) ||
          (currentTime <= bookingStartTime && slotEndTime >= bookingEndTime)
        ) {
          isAvailable = false;
          break;
        }
      }
      
      // Handle break time if set
      if (dayBusinessHours.breakStart && dayBusinessHours.breakEnd) {
        const breakStart = parse(`${date} ${dayBusinessHours.breakStart}`, 'yyyy-MM-dd HH:mm', new Date());
        const breakEnd = parse(`${date} ${dayBusinessHours.breakEnd}`, 'yyyy-MM-dd HH:mm', new Date());
        
        if (
          (currentTime >= breakStart && currentTime < breakEnd) ||
          (slotEndTime > breakStart && slotEndTime <= breakEnd) ||
          (currentTime <= breakStart && slotEndTime >= breakEnd)
        ) {
          isAvailable = false;
        }
      }
      
      // Add the time slot
      timeSlots.push({
        time: timeSlotStr,
        available: isAvailable
      });
      
      // Move to next slot
      currentTime.setMinutes(currentTime.getMinutes() + slotInterval);
    }
    
    return timeSlots;
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

  // Business Hours operations
  async getBusinessHours(): Promise<BusinessHours[]> {
    return await db.select().from(businessHours).orderBy(businessHours.dayOfWeek);
  }

  async getBusinessHoursByDay(dayOfWeek: number): Promise<BusinessHours | undefined> {
    const [hours] = await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.dayOfWeek, dayOfWeek));
    return hours;
  }

  async createBusinessHours(hoursData: Omit<BusinessHours, "id">): Promise<BusinessHours> {
    // Check if hours for this day already exist
    const existingHours = await this.getBusinessHoursByDay(hoursData.dayOfWeek);
    
    if (existingHours) {
      // Update existing hours instead of creating new ones
      const [updated] = await db
        .update(businessHours)
        .set(hoursData)
        .where(eq(businessHours.id, existingHours.id))
        .returning();
      return updated;
    }
    
    // Create new hours
    const [hours] = await db.insert(businessHours).values(hoursData).returning();
    return hours;
  }

  async updateBusinessHours(id: number, hoursData: Partial<Omit<BusinessHours, "id">>): Promise<BusinessHours | undefined> {
    const [hours] = await db
      .update(businessHours)
      .set(hoursData)
      .where(eq(businessHours.id, id))
      .returning();
    return hours;
  }

  // Special Dates operations
  async getSpecialDates(): Promise<SpecialDate[]> {
    return await db.select().from(specialDates).orderBy(specialDates.date);
  }

  async getSpecialDate(date: string): Promise<SpecialDate | undefined> {
    const [specialDate] = await db
      .select()
      .from(specialDates)
      .where(eq(specialDates.date, date));
    return specialDate;
  }

  async createSpecialDate(specialDateData: Omit<SpecialDate, "id">): Promise<SpecialDate> {
    // Check if this date already exists
    const existingDate = await this.getSpecialDate(specialDateData.date);
    
    if (existingDate) {
      // Update existing date instead of creating a new one
      const [updated] = await db
        .update(specialDates)
        .set(specialDateData)
        .where(eq(specialDates.id, existingDate.id))
        .returning();
      return updated;
    }
    
    // Create new special date
    const [specialDate] = await db.insert(specialDates).values(specialDateData).returning();
    return specialDate;
  }

  async updateSpecialDate(id: number, specialDateData: Partial<Omit<SpecialDate, "id">>): Promise<SpecialDate | undefined> {
    const [specialDate] = await db
      .update(specialDates)
      .set(specialDateData)
      .where(eq(specialDates.id, id))
      .returning();
    return specialDate;
  }

  async deleteSpecialDate(id: number): Promise<boolean> {
    await db.delete(specialDates).where(eq(specialDates.id, id));
    return true;
  }

  // Stylist operations
  async getStylists(): Promise<Stylist[]> {
    return await db.select().from(stylists);
  }

  async getActiveStylists(): Promise<Stylist[]> {
    return await db.select().from(stylists).where(eq(stylists.isActive, true));
  }

  async getStylist(id: number): Promise<Stylist | undefined> {
    const [stylist] = await db.select().from(stylists).where(eq(stylists.id, id));
    return stylist;
  }

  async createStylist(stylistData: Omit<Stylist, "id">): Promise<Stylist> {
    const [stylist] = await db.insert(stylists).values(stylistData).returning();
    return stylist;
  }

  async updateStylist(id: number, stylistData: Partial<Omit<Stylist, "id">>): Promise<Stylist | undefined> {
    const [stylist] = await db
      .update(stylists)
      .set(stylistData)
      .where(eq(stylists.id, id))
      .returning();
    return stylist;
  }

  async deleteStylist(id: number): Promise<boolean> {
    await db.delete(stylists).where(eq(stylists.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
