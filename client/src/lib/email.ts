import { BookingFormData } from "@shared/schema";

// This is a client-side utility for handling email-related functions
export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

// Common email template wrapper with KARI STYLEZ branding
function emailTemplate(title: string, content: string): string {
  return `
    <div style="font-family: 'Cormorant Garamond', 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff;">
      <div style="background: linear-gradient(135deg, #d4af37, #fbf5b7, #d4af37); padding: 20px; color: #2a2a2a; text-align: center; border-radius: 6px 6px 0 0; border-bottom: 3px solid #d4af37;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">${title}</h1>
      </div>
      
      <div style="padding: 25px; color: #333;">
        ${content}
      </div>
      
      <div style="background-color: #2a2a2a; padding: 20px; text-align: center; color: #d4af37; border-radius: 0 0 6px 6px;">
        <div style="margin-bottom: 15px;">
          <a href="https://instagram.com/karistylez" style="color: #d4af37; margin: 0 10px; text-decoration: none; font-weight: bold;">Instagram</a>
          <a href="https://karistylez.com" style="color: #d4af37; margin: 0 10px; text-decoration: none; font-weight: bold;">Website</a>
          <a href="tel:+1234567890" style="color: #d4af37; margin: 0 10px; text-decoration: none; font-weight: bold;">Call Us</a>
        </div>
        <p style="margin: 5px 0; font-size: 12px;">© 2025 KARI STYLEZ. All rights reserved.</p>
        <p style="margin: 5px 0; font-size: 12px;">123 Braiding Way, New York, NY 10001</p>
      </div>
    </div>
  `;
}

// Format content for booking notification to salon
export function formatBookingEmailBody(booking: BookingFormData): string {
  const content = `
    <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-top: 0;">New Booking Request</h2>
    <div style="background-color: #f8f4e5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #d4af37;">
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
      <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
      <p><strong>Notes:</strong> ${booking.notes || 'N/A'}</p>
    </div>
    <p>Please review and confirm this booking in your admin dashboard.</p>
  `;
  
  return emailTemplate("New Booking Alert", content);
}

// Format content for booking confirmation to client
export function formatConfirmationEmailBody(booking: BookingFormData): string {
  const content = `
    <p style="font-size: 18px;">Dear ${booking.name},</p>
    
    <p>Thank you for choosing KARI STYLEZ! We've received your booking request and are excited to transform your look.</p>
    
    <div style="background-color: #f8f4e5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #d4af37;">
      <h3 style="color: #d4af37; margin-top: 0;">Booking Details</h3>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
      <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
      <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">Pending Confirmation</span></p>
    </div>
    
    <p>One of our stylists will review your request and confirm your appointment shortly. You'll receive another email once your booking is confirmed.</p>
    
    <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 25px 0; color: #fff;">
      <h3 style="color: #d4af37; margin-top: 0;">What's Next?</h3>
      <ul style="color: #fff; padding-left: 20px;">
        <li>You'll receive a confirmation email once your appointment is approved</li>
        <li>We'll send you a reminder 24 hours before your appointment</li>
        <li>A $50 deposit will be required to secure your booking</li>
      </ul>
    </div>
    
    <p>If you have any questions or need to make changes, please contact us at <a href="mailto:contact@karistylez.com" style="color: #d4af37;">contact@karistylez.com</a> or call us at <a href="tel:+1234567890" style="color: #d4af37;">(123) 456-7890</a>.</p>
    
    <p style="margin-top: 30px;">We look forward to seeing you soon!</p>
    <p style="margin-bottom: 0;"><strong>The KARI STYLEZ Team</strong></p>
  `;
  
  return emailTemplate("Booking Received", content);
}

// Format content for contact form submissions
export function formatServiceEmailBody(
  name: string,
  email: string,
  message: string
): string {
  const content = `
    <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Contact Form Submission</h2>
    <div style="background-color: #f8f4e5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #d4af37;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    </div>
    <p>Please respond to this inquiry as soon as possible.</p>
  `;
  
  return emailTemplate("New Contact Request", content);
}

// Format content for same-day appointment reminder
export function formatSameDayReminderEmailBody(booking: BookingFormData): string {
  const content = `
    <p style="font-size: 18px;">Dear ${booking.name},</p>
    
    <p>This is a friendly reminder that you have an appointment at KARI STYLEZ <strong>today</strong>.</p>
    
    <div style="background-color: #f8f4e5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #d4af37;">
      <h3 style="color: #d4af37; margin-top: 0;">Appointment Details</h3>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> <strong style="color: #d4af37;">TODAY - ${formatDate(booking.date)}</strong></p>
      <p><strong>Time:</strong> <strong style="color: #d4af37;">${formatTime(booking.time)}</strong></p>
    </div>
    
    <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 25px 0; color: #fff;">
      <h3 style="color: #d4af37; margin-top: 0;">Reminder</h3>
      <ul style="color: #fff; padding-left: 20px;">
        <li>Please arrive 10 minutes before your scheduled time</li>
        <li>Bring any reference photos of styles you like</li>
        <li>Any rescheduling must be done at least 24 hours in advance</li>
      </ul>
    </div>
    
    <p>We look forward to serving you today! If you have any questions, please call us at <a href="tel:+1234567890" style="color: #d4af37;">(123) 456-7890</a>.</p>
    
    <p style="margin-top: 30px;">See you soon!</p>
    <p style="margin-bottom: 0;"><strong>The KARI STYLEZ Team</strong></p>
  `;
  
  return emailTemplate("TODAY'S APPOINTMENT REMINDER", content);
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

// Helper function to format time
function formatTime(timeString: string): string {
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${formattedHour}:${minutes} ${period}`;
}
