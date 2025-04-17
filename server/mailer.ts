import nodemailer, { Transporter } from 'nodemailer';
import { Booking } from '@shared/schema';
import { formatBookingEmailBody, formatConfirmationEmailBody, EmailOptions } from '../client/src/lib/email';

let transporter: Transporter;

function setupMailer() {
  console.log('Setting up production email service with provided credentials');
  
  try {
    // For Gmail with app passwords, use the full SMTP configuration
    const secureConnection = process.env.EMAIL_SECURE === 'true';
    const port = parseInt(process.env.EMAIL_PORT || '587');
    
    // Using direct SMTP configuration instead of 'service: gmail'
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: port,
      secure: secureConnection, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
      debug: true, // Show debug output
      logger: true, // Log information to the console
    });
    
    // Log the user we're trying to authenticate with for debugging
    console.log(`Attempting to authenticate with email: ${process.env.EMAIL_USER}`);
    
    // Verify connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.error('Email service configuration error:', error);
        console.log('Error details:', error.message);
        console.log('SMTP Settings used:', {
          host: 'smtp.gmail.com',
          port: port,
          secure: secureConnection,
          user: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 5) + '...' : undefined
        });
        
        // If production email fails, fall back to Ethereal for testing
        console.log('Falling back to Ethereal for testing purposes');
        setupEtherealMailer();
      } else {
        console.log('Production email server is ready to send messages');
      }
    });
  } catch (error) {
    console.error('Error setting up email service:', error);
    // Fall back to Ethereal if there's an error
    setupEtherealMailer();
  }
}

// Setup Ethereal as fallback
function setupEtherealMailer() {
  console.log('Setting up Ethereal email service as fallback');
  nodemailer.createTestAccount().then(testAccount => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal email credentials: ${testAccount.user} / ${testAccount.pass}`);
    console.log('View emails at: https://ethereal.email/messages');
    
    transporter.verify(function(error, success) {
      if (error) {
        console.error('Ethereal email service configuration error:', error);
      } else {
        console.log('Ethereal email server is ready to send messages');
      }
    });
  }).catch(err => {
    console.error('Failed to set up Ethereal account:', err);
  });
}

// Setup mailer on import
setupMailer();

/**
 * Send an email using the configured transport
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"KARI STYLEZ" <noreply@karistylez.com>',
      to: options.to,
      subject: options.subject,
      html: options.body,
    });

    console.log(`Email sent: ${info.messageId}`);
    
    // If using Ethereal, show the preview URL
    if (info.messageId.includes('ethereal')) {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a booking confirmation email to the client
 */
export async function sendBookingConfirmationEmail(booking: Booking): Promise<boolean> {
  const emailBody = formatConfirmationEmailBody(booking);
  
  return await sendEmail({
    to: booking.email,
    subject: 'Booking Confirmation - KARI STYLEZ',
    body: emailBody,
  });
}

/**
 * Send a booking notification email to the salon
 */
export async function sendBookingNotificationEmail(booking: Booking): Promise<boolean> {
  const emailBody = formatBookingEmailBody(booking);
  
  return await sendEmail({
    to: process.env.SALON_EMAIL || 'bookings@karistylez.com',
    subject: 'New Booking Notification - KARI STYLEZ',
    body: emailBody,
  });
}

/**
 * Send a booking cancellation email to the client
 */
export async function sendBookingCancellationEmail(booking: Booking): Promise<boolean> {
  // Create branded email content for cancellation
  const content = `
    <p style="font-size: 18px;">Dear ${booking.name},</p>
    
    <p>Your appointment at KARI STYLEZ has been cancelled as requested. Here are the details of the cancelled appointment:</p>
    
    <div style="background-color: #f8f4e5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #d4af37;">
      <h3 style="color: #d4af37; margin-top: 0;">Cancelled Appointment Details</h3>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <p><strong>Status:</strong> <span style="color: #e53935; font-weight: bold;">Cancelled</span></p>
    </div>
    
    <p>If you'd like to reschedule, please visit our website to book a new appointment or call us at <a href="tel:+1234567890" style="color: #d4af37;">(123) 456-7890</a>.</p>
    
    <p>Thank you for choosing KARI STYLEZ. We hope to see you soon!</p>
    
    <p style="margin-top: 30px;">Best regards,<br>The KARI STYLEZ Team</p>
  `;
  
  // Use the common email template function
  const emailBody = `
    <div style="font-family: 'Cormorant Garamond', 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff;">
      <div style="background: linear-gradient(135deg, #d4af37, #fbf5b7, #d4af37); padding: 20px; color: #2a2a2a; text-align: center; border-radius: 6px 6px 0 0; border-bottom: 3px solid #d4af37;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Appointment Cancelled</h1>
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
  
  return await sendEmail({
    to: booking.email,
    subject: 'Booking Cancellation - KARI STYLEZ',
    body: emailBody,
  });
}

/**
 * Send a reminder email for an upcoming appointment (1-2 days before)
 */
export async function sendReminderEmail(booking: Booking): Promise<boolean> {
  // Create branded email content for reminder
  const content = `
    <p style="font-size: 18px;">Dear ${booking.name},</p>
    
    <p>This is a friendly reminder of your upcoming appointment at KARI STYLEZ:</p>
    
    <div style="background-color: #f8f4e5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #d4af37;">
      <h3 style="color: #d4af37; margin-top: 0;">Appointment Details</h3>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
    </div>
    
    <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 25px 0; color: #fff;">
      <h3 style="color: #d4af37; margin-top: 0;">What to bring:</h3>
      <ul style="color: #fff; padding-left: 20px;">
        <li>Reference photos of your desired style (if available)</li>
        <li>Any hair extensions or products you'd like us to use</li>
        <li>A comfortable outfit</li>
      </ul>
    </div>
    
    <p style="font-weight: bold;">Please arrive 10 minutes before your scheduled time.</p>
    
    <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
    
    <p>We look forward to seeing you!</p>
    
    <p style="margin-top: 30px;">Best regards,<br>The KARI STYLEZ Team</p>
  `;
  
  // Use the common email template function
  const emailBody = `
    <div style="font-family: 'Cormorant Garamond', 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff;">
      <div style="background: linear-gradient(135deg, #d4af37, #fbf5b7, #d4af37); padding: 20px; color: #2a2a2a; text-align: center; border-radius: 6px 6px 0 0; border-bottom: 3px solid #d4af37;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Appointment Reminder</h1>
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
  
  return await sendEmail({
    to: booking.email,
    subject: 'Appointment Reminder - KARI STYLEZ',
    body: emailBody,
  });
}

/**
 * Send a same-day reminder email (for appointments happening today)
 */
export async function sendSameDayReminderEmail(booking: Booking): Promise<boolean> {
  // Create branded email content for same-day reminder
  const content = `
    <p style="font-size: 18px;">Dear ${booking.name},</p>
    
    <p>This is a friendly reminder that you have an appointment at KARI STYLEZ <strong>today</strong>.</p>
    
    <div style="background-color: #f8f4e5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #d4af37;">
      <h3 style="color: #d4af37; margin-top: 0;">Appointment Details</h3>
      <p><strong>Service:</strong> ${booking.serviceType}</p>
      <p><strong>Date:</strong> <strong style="color: #d4af37;">TODAY - ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></p>
      <p><strong>Time:</strong> <strong style="color: #d4af37;">${booking.time}</strong></p>
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
  
  // Use the common email template function
  const emailBody = `
    <div style="font-family: 'Cormorant Garamond', 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff;">
      <div style="background: linear-gradient(135deg, #d4af37, #fbf5b7, #d4af37); padding: 20px; color: #2a2a2a; text-align: center; border-radius: 6px 6px 0 0; border-bottom: 3px solid #d4af37;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">TODAY'S APPOINTMENT REMINDER</h1>
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
  
  return await sendEmail({
    to: booking.email,
    subject: 'TODAY\'S APPOINTMENT - KARI STYLEZ',
    body: emailBody,
  });
}