import { BookingFormData } from "@shared/schema";

// This is a client-side utility for handling email-related functions

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export function formatBookingEmailBody(booking: BookingFormData): string {
  return `
    <h2>New Booking Request</h2>
    <p><strong>Name:</strong> ${booking.name}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Service:</strong> ${booking.serviceType}</p>
    <p><strong>Date:</strong> ${booking.date}</p>
    <p><strong>Time:</strong> ${booking.time}</p>
    <p><strong>Notes:</strong> ${booking.notes || 'N/A'}</p>
  `;
}

export function formatConfirmationEmailBody(booking: BookingFormData): string {
  return `
    <h2>Thank You for Your Booking!</h2>
    <p>Dear ${booking.name},</p>
    <p>We have received your booking request for ${booking.serviceType} on ${booking.date} at ${booking.time}.</p>
    <p>We will review your request and confirm your appointment shortly.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>Divine Braids Team</p>
  `;
}

export function formatServiceEmailBody(
  name: string,
  email: string,
  message: string
): string {
  return `
    <h2>Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;
}
