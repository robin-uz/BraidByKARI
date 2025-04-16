import { Booking } from '@shared/schema';
import { storage } from './storage';
import { sendReminderEmail } from './mailer';

/**
 * Send a reminder email to a client
 */
export async function sendBookingReminder(booking: Booking): Promise<boolean> {
  return await sendReminderEmail(booking);
}

/**
 * Process all bookings and send reminders for upcoming appointments
 * This should be called on a schedule (e.g., daily)
 */
export async function processReminderBatch(): Promise<number> {
  try {
    const bookings = await storage.getBookings();
    const now = new Date();
    let remindersSent = 0;
    
    // Get bookings that are 1-2 days in the future and confirmed
    const upcomingBookings = bookings.filter(booking => {
      if (booking.status !== 'confirmed') return false;
      
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      const diffTime = bookingDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      // Send reminders for appointments 1-2 days away
      return diffDays >= 1 && diffDays <= 2;
    });
    
    // Send reminders
    for (const booking of upcomingBookings) {
      const success = await sendBookingReminder(booking);
      if (success) remindersSent++;
    }
    
    console.log(`Sent ${remindersSent} reminders out of ${upcomingBookings.length} upcoming bookings`);
    return remindersSent;
  } catch (error) {
    console.error('Error processing reminder batch:', error);
    return 0;
  }
}

// Function to schedule reminder checks
// This could be called by a timer or cron job
export async function scheduleReminderCheck(): Promise<void> {
  console.log('Scheduling reminder check');
  
  // In a production environment, this would be a cron job
  // For demo purposes, we'll just run it once and then schedule it to run daily
  await processReminderBatch();
  
  // Schedule to run daily at a specific time (e.g., 9 AM)
  // This is a simplified implementation for demo purposes
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
  
  console.log(`Next reminder check scheduled for ${tomorrow.toLocaleString()}`);
  
  // Schedule the next run
  setTimeout(scheduleReminderCheck, timeUntilTomorrow);
}