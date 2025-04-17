import { Booking } from '@shared/schema';
import { storage } from './storage';
import { sendReminderEmail, sendSameDayReminderEmail } from './mailer';

/**
 * Send a reminder email to a client based on timing
 * For appointments 1-2 days away, uses the standard reminder
 * For appointments today, uses the same-day reminder
 */
export async function sendBookingReminder(booking: Booking, isSameDay = false): Promise<boolean> {
  if (isSameDay) {
    return await sendSameDayReminderEmail(booking);
  } else {
    return await sendReminderEmail(booking);
  }
}

/**
 * Process all bookings and send reminders for upcoming appointments
 * This should be called on a schedule (e.g., daily)
 * Handles both advance reminders (1-2 days) and same-day reminders
 */
export async function processReminderBatch(): Promise<number> {
  try {
    const bookings = await storage.getBookings();
    const now = new Date();
    let remindersSent = 0;
    
    // Format today's date as YYYY-MM-DD for comparison
    const todayStr = now.toISOString().split('T')[0];
    
    // Get confirmed bookings
    const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
    
    // Process advance reminders (1-2 days away)
    const advanceReminders = confirmedBookings.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      const diffTime = bookingDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      // Send reminders for appointments 1-2 days away
      return diffDays >= 1 && diffDays <= 2;
    });
    
    // Process same-day reminders
    const sameDayReminders = confirmedBookings.filter(booking => {
      // Check if the booking is today
      return booking.date === todayStr;
    });
    
    // Send advance reminders
    console.log(`Processing ${advanceReminders.length} advance reminders (1-2 days ahead)`);
    for (const booking of advanceReminders) {
      const success = await sendBookingReminder(booking, false);
      if (success) remindersSent++;
    }
    
    // Send same-day reminders
    console.log(`Processing ${sameDayReminders.length} same-day reminders`);
    for (const booking of sameDayReminders) {
      const success = await sendBookingReminder(booking, true);
      if (success) remindersSent++;
    }
    
    console.log(`Sent ${remindersSent} total reminders (${advanceReminders.length} advance, ${sameDayReminders.length} same-day)`);
    return remindersSent;
  } catch (error) {
    console.error('Error processing reminder batch:', error);
    return 0;
  }
}

/**
 * Schedule reminder checks to run on a regular basis
 * In production, this would be replaced with a proper cron job
 */
export async function scheduleReminderCheck(): Promise<void> {
  console.log('Starting reminder service for KARI STYLEZ');
  
  try {
    // Run immediately on startup
    const remindersSent = await processReminderBatch();
    console.log(`Initial reminder check complete. Sent ${remindersSent} reminders.`);
    
    // Schedule to run twice daily - morning (9 AM) and afternoon (2 PM)
    // This catches both advance reminders and ensures same-day reminders go out early enough
    
    // Helper function to schedule the next run
    const scheduleNextRun = () => {
      const now = new Date();
      const isAfternoon = now.getHours() >= 14; // 2 PM or later
      
      // Target time: either 9 AM or 2 PM
      const targetHour = isAfternoon ? 9 : 14;
      
      // If we're after 2 PM, schedule for 9 AM tomorrow, otherwise 2 PM today
      const target = new Date(now);
      if (isAfternoon) {
        target.setDate(target.getDate() + 1);
      }
      target.setHours(targetHour, 0, 0, 0);
      
      // Calculate time until next run
      const timeUntilTarget = target.getTime() - now.getTime();
      
      console.log(`Next reminder check scheduled for ${target.toLocaleString()}`);
      
      // Schedule the next run
      setTimeout(async () => {
        console.log('Running scheduled reminder check');
        await processReminderBatch();
        scheduleNextRun(); // Schedule the next run after this one completes
      }, timeUntilTarget);
    };
    
    // Start the scheduling cycle
    scheduleNextRun();
    
  } catch (error) {
    console.error('Error in reminder scheduling:', error);
    
    // If there's an error, try again in an hour
    console.log('Will retry reminder service in 1 hour');
    setTimeout(scheduleReminderCheck, 60 * 60 * 1000);
  }
}