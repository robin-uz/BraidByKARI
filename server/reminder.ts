import nodemailer from 'nodemailer';
import { Booking } from '@shared/schema';
import { storage } from './storage';
import { addDays, parseISO, format } from 'date-fns';

// Email configuration
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

/**
 * Send a reminder email to a client
 */
export async function sendReminderEmail(booking: Booking): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not configured, skipping reminder');
    return false;
  }

  try {
    await gmailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Appointment Reminder - Divine Braids',
      html: `
        <h2>Your Appointment Reminder</h2>
        <p>Dear ${booking.name},</p>
        <p>This is a friendly reminder of your upcoming appointment:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>Service:</strong> ${booking.serviceType}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
        </div>
        <p>We're looking forward to seeing you!</p>
        <p>If you need to reschedule, please contact us as soon as possible.</p>
        <p>Best regards,</p>
        <p>Divine Braids Team</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
}

/**
 * Process all bookings and send reminders for upcoming appointments
 * This should be called on a schedule (e.g., daily)
 */
export async function processReminderBatch(): Promise<number> {
  try {
    const bookings = await storage.getBookings();
    
    // Get confirmed bookings with appointments coming up soon
    const upcomingBookings = bookings.filter(booking => {
      if (booking.status !== 'confirmed') return false;
      
      try {
        // Parse the date string to a Date object
        // In a real app, this would be stored as a proper Date in the database
        const bookingDate = parseISO(booking.date);
        
        // Check if the booking is tomorrow
        const tomorrow = addDays(new Date(), 1);
        
        return format(bookingDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Error parsing date for booking:', booking.id, error);
        return false;
      }
    });

    console.log(`Found ${upcomingBookings.length} bookings for reminder emails`);
    
    // Send reminders
    let remindersSent = 0;
    for (const booking of upcomingBookings) {
      const success = await sendReminderEmail(booking);
      if (success) remindersSent++;
    }
    
    return remindersSent;
  } catch (error) {
    console.error('Error processing reminder batch:', error);
    return 0;
  }
}

// This function would be called by a scheduled job (like a cron job)
// For now, we'll expose it through an API endpoint that you'd call daily
export async function scheduleReminderCheck(): Promise<void> {
  console.log('Starting scheduled reminder check...');
  const remindersSent = await processReminderBatch();
  console.log(`Reminder check complete. Sent ${remindersSent} reminders.`);
}