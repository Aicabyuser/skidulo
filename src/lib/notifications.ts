
import { format } from "date-fns";

// Types for notifications
export type NotificationType = "confirmation" | "reminder" | "cancellation" | "reschedule";

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: NotificationType;
  scheduledFor?: Date;
}

export interface BookingNotificationData {
  recipientEmail: string;
  recipientName: string;
  providerName: string;
  serviceName: string;
  date: Date;
  time: string;
  meetingType: "video" | "in-person";
  reminderTime?: "1day" | "1hour" | "30min";
}

// Mock function to send email (in a real app, this would connect to an email service like SendGrid, Mailgun, etc.)
export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  // For demo purposes, we'll just log the email and return success
  console.log("Sending email notification:", notification);
  
  // Simulate API call to email service
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

// Create email content for booking confirmation
export const createBookingConfirmationEmail = (data: BookingNotificationData): EmailNotification => {
  const formattedDate = format(data.date, "EEEE, MMMM d, yyyy");
  
  return {
    to: data.recipientEmail,
    subject: `Booking Confirmation: ${data.serviceName} with ${data.providerName}`,
    body: `
      Hello ${data.recipientName},

      Your booking has been confirmed!

      Details:
      - Service: ${data.serviceName}
      - Provider: ${data.providerName}
      - Date: ${formattedDate}
      - Time: ${data.time}
      - Meeting Type: ${data.meetingType === "video" ? "Video Call" : "In-Person"}

      ${data.meetingType === "video" ? "You will receive a link to join the video call closer to the appointment time." : "Please arrive 5 minutes before your scheduled appointment time."}

      Need to make changes? You can reschedule or cancel your appointment through our platform.

      Thank you for booking with us!
    `,
    type: "confirmation"
  };
};

// Create email content for booking reminder
export const createBookingReminderEmail = (data: BookingNotificationData): EmailNotification => {
  const formattedDate = format(data.date, "EEEE, MMMM d, yyyy");
  let reminderText = "tomorrow";
  
  if (data.reminderTime === "1hour") {
    reminderText = "in 1 hour";
  } else if (data.reminderTime === "30min") {
    reminderText = "in 30 minutes";
  }
  
  return {
    to: data.recipientEmail,
    subject: `Reminder: Your appointment with ${data.providerName} is ${reminderText}`,
    body: `
      Hello ${data.recipientName},

      This is a friendly reminder that your appointment is scheduled for ${reminderText}!

      Details:
      - Service: ${data.serviceName}
      - Provider: ${data.providerName}
      - Date: ${formattedDate}
      - Time: ${data.time}
      - Meeting Type: ${data.meetingType === "video" ? "Video Call" : "In-Person"}

      ${data.meetingType === "video" ? "You will receive a link to join the video call 15 minutes before the appointment." : "Please arrive 5 minutes before your scheduled appointment time."}

      Need to make changes? You can reschedule or cancel your appointment through our platform.

      We look forward to seeing you!
    `,
    type: "reminder",
    scheduledFor: data.date
  };
};

// Schedule notifications for a booking
export const scheduleBookingNotifications = async (data: BookingNotificationData): Promise<void> => {
  try {
    // Send immediate confirmation email
    const confirmationEmail = createBookingConfirmationEmail(data);
    await sendEmailNotification(confirmationEmail);
    
    // In a real application, you would use a job scheduler or queue service
    // to schedule reminder emails. For this demo, we'll simulate scheduling.
    
    // Schedule 1-day reminder (in a real app, this would be stored in a database)
    const oneDayBefore = new Date(data.date);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    console.log(`Scheduled 1-day reminder email for ${format(oneDayBefore, "yyyy-MM-dd HH:mm")}`);
    
    // Schedule 1-hour reminder
    const oneHourBefore = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    oneHourBefore.setHours(hours, minutes);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);
    console.log(`Scheduled 1-hour reminder email for ${format(oneHourBefore, "yyyy-MM-dd HH:mm")}`);
  } catch (error) {
    console.error("Failed to schedule booking notifications:", error);
    throw new Error("Failed to schedule booking notifications");
  }
};
