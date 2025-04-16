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
      from: process.env.EMAIL_FROM || '"Divine Braids" <noreply@divinebraids.com>',
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
    subject: 'Booking Confirmation - Divine Braids',
    body: emailBody,
  });
}

/**
 * Send a booking notification email to the salon
 */
export async function sendBookingNotificationEmail(booking: Booking): Promise<boolean> {
  const emailBody = formatBookingEmailBody(booking);
  
  return await sendEmail({
    to: process.env.SALON_EMAIL || 'bookings@divinebraids.com',
    subject: 'New Booking Notification',
    body: emailBody,
  });
}

/**
 * Send a booking cancellation email to the client
 */
export async function sendBookingCancellationEmail(booking: Booking): Promise<boolean> {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background: linear-gradient(to right, #8a2be2, #ff00ff); padding: 20px; color: white; text-align: center; border-radius: 6px 6px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Booking Cancellation</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear ${booking.name},</p>
        
        <p>Your appointment at Divine Braids has been cancelled as requested. Here are the details of the cancelled appointment:</p>
        
        <div style="background-color: #f9f0ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Service:</strong> ${booking.serviceType}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
        </div>
        
        <p>If you'd like to reschedule, please visit our website to book a new appointment.</p>
        
        <p>Thank you for choosing Divine Braids. We hope to see you soon!</p>
        
        <p style="margin-top: 30px;">Best regards,<br>The Divine Braids Team</p>
      </div>
      
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 6px 6px;">
        <p>© 2025 Divine Braids. All rights reserved.</p>
        <p>123 Hair Street, Style City, SC 12345</p>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: booking.email,
    subject: 'Booking Cancellation - Divine Braids',
    body: emailBody,
  });
}

/**
 * Send a reminder email for an upcoming appointment
 */
export async function sendReminderEmail(booking: Booking): Promise<boolean> {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background: linear-gradient(to right, #8a2be2, #ff00ff); padding: 20px; color: white; text-align: center; border-radius: 6px 6px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Appointment Reminder</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear ${booking.name},</p>
        
        <p>This is a friendly reminder of your upcoming appointment at Divine Braids:</p>
        
        <div style="background-color: #f9f0ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Service:</strong> ${booking.serviceType}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
        </div>
        
        <h3 style="color: #8a2be2;">What to bring:</h3>
        <ul>
          <li>Reference photos of your desired style (if available)</li>
          <li>Any hair extensions or products you'd like us to use</li>
          <li>A comfortable outfit</li>
        </ul>
        
        <p style="font-weight: bold;">Please arrive 10 minutes before your scheduled time.</p>
        
        <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
        
        <p>We look forward to seeing you!</p>
        
        <p style="margin-top: 30px;">Best regards,<br>The Divine Braids Team</p>
      </div>
      
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 6px 6px;">
        <p>© 2025 Divine Braids. All rights reserved.</p>
        <p>123 Hair Street, Style City, SC 12345</p>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: booking.email,
    subject: 'Appointment Reminder - Divine Braids',
    body: emailBody,
  });
}