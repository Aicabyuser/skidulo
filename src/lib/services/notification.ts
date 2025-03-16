import { Appointment } from '@/lib/types/calendar';
import { supabase } from '@/lib/supabase';

interface EmailTemplate {
  subject: string;
  body: string;
}

class NotificationService {
  private async getAppointmentDetails(appointment: Appointment) {
    const { data: appointmentType } = await supabase
      .from('appointment_types')
      .select('*')
      .eq('id', appointment.appointmentTypeId)
      .single();

    const { data: host } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', appointmentType.hostId)
      .single();

    const { data: customer } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', appointment.customerId)
      .single();

    return {
      appointmentType,
      host,
      customer,
    };
  }

  private getEmailTemplate(
    type: 'created' | 'updated' | 'cancelled',
    appointment: Appointment,
    details: {
      appointmentType: any;
      host: { email: string; full_name: string };
      customer: { email: string; full_name: string };
    }
  ): { host: EmailTemplate; customer: EmailTemplate } {
    const date = new Date(appointment.startTime);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const templates = {
      created: {
        host: {
          subject: `New Booking: ${details.appointmentType.name} with ${details.customer.full_name}`,
          body: `
            A new booking has been made for ${details.appointmentType.name}
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Customer: ${details.customer.full_name}
            
            ${appointment.status === 'pending' ? 'Please review and confirm this booking.' : 'This booking has been automatically confirmed.'}
          `,
        },
        customer: {
          subject: `Booking Confirmation: ${details.appointmentType.name}`,
          body: `
            Thank you for booking ${details.appointmentType.name}
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Host: ${details.host.full_name}
            
            ${appointment.status === 'pending' 
              ? 'Your booking is pending confirmation. We will notify you once it is confirmed.'
              : 'Your booking has been confirmed.'}
            
            ${details.appointmentType.locationOptions.includes('online')
              ? 'A meeting link will be provided closer to the appointment time.'
              : 'Location details will be provided by the host.'}
          `,
        },
      },
      updated: {
        host: {
          subject: `Appointment Status Updated: ${details.appointmentType.name}`,
          body: `
            The status of your appointment has been updated.
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Customer: ${details.customer.full_name}
            - Status: ${appointment.status}
          `,
        },
        customer: {
          subject: `Appointment Status Updated: ${details.appointmentType.name}`,
          body: `
            The status of your appointment has been updated.
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Host: ${details.host.full_name}
            - Status: ${appointment.status}
            
            ${appointment.status === 'confirmed'
              ? details.appointmentType.locationOptions.includes('online')
                ? 'A meeting link will be provided closer to the appointment time.'
                : 'Location details will be provided by the host.'
              : ''}
          `,
        },
      },
      cancelled: {
        host: {
          subject: `Appointment Cancelled: ${details.appointmentType.name}`,
          body: `
            An appointment has been cancelled.
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Customer: ${details.customer.full_name}
          `,
        },
        customer: {
          subject: `Appointment Cancelled: ${details.appointmentType.name}`,
          body: `
            Your appointment has been cancelled.
            
            Details:
            - Date: ${formattedDate}
            - Time: ${formattedTime}
            - Duration: ${details.appointmentType.duration} minutes
            - Host: ${details.host.full_name}
            
            Please feel free to book another appointment.
          `,
        },
      },
    };

    return templates[type];
  }

  async sendAppointmentNotification(
    type: 'created' | 'updated' | 'cancelled',
    appointment: Appointment
  ) {
    try {
      const details = await this.getAppointmentDetails(appointment);
      const templates = this.getEmailTemplate(type, appointment, details);

      // Send email to host
      await this.sendEmail(
        details.host.email,
        templates.host.subject,
        templates.host.body
      );

      // Send email to customer
      await this.sendEmail(
        details.customer.email,
        templates.customer.subject,
        templates.customer.body
      );

      // Save notification to database for history
      await supabase.from('notifications').insert([
        {
          appointmentId: appointment.id,
          type,
          recipientId: details.host.id,
          status: 'sent',
        },
        {
          appointmentId: appointment.id,
          type,
          recipientId: details.customer.id,
          status: 'sent',
        },
      ]);
    } catch (error) {
      console.error('Error sending appointment notification:', error);
      throw error;
    }
  }

  private async sendEmail(to: string, subject: string, body: string) {
    // TODO: Implement email sending using your preferred email service
    // Examples: SendGrid, AWS SES, SMTP, etc.
    console.log('Sending email:', { to, subject, body });
  }
}

export const notificationService = new NotificationService(); 