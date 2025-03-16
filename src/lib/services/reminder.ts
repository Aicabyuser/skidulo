import { Appointment } from '@/lib/types/calendar';
import { supabase } from '@/lib/supabase';
import { notificationService } from './notification';

interface ReminderSettings {
  initialReminder: number; // hours before appointment
  followUpReminder: number; // hours before appointment
  hostReminder: number; // hours before appointment
}

class ReminderService {
  private defaultSettings: ReminderSettings = {
    initialReminder: 24, // 24 hours before
    followUpReminder: 2, // 2 hours before
    hostReminder: 1, // 1 hour before
  };

  async scheduleReminders(appointment: Appointment) {
    try {
      const settings = await this.getReminderSettings(appointment.appointment_types.hostId);
      const startTime = new Date(appointment.startTime);

      // Calculate reminder times
      const reminders = [
        {
          type: 'initial',
          sendAt: new Date(startTime.getTime() - settings.initialReminder * 60 * 60 * 1000),
        },
        {
          type: 'followUp',
          sendAt: new Date(startTime.getTime() - settings.followUpReminder * 60 * 60 * 1000),
        },
        {
          type: 'host',
          sendAt: new Date(startTime.getTime() - settings.hostReminder * 60 * 60 * 1000),
        },
      ];

      // Schedule reminders in database
      const { data, error } = await supabase
        .from('reminders')
        .insert(
          reminders.map((reminder) => ({
            appointmentId: appointment.id,
            type: reminder.type,
            sendAt: reminder.sendAt.toISOString(),
            status: 'pending',
          }))
        );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error scheduling reminders:', error);
      throw error;
    }
  }

  async updateReminders(appointment: Appointment) {
    try {
      // Cancel existing reminders
      await supabase
        .from('reminders')
        .update({ status: 'cancelled' })
        .eq('appointmentId', appointment.id)
        .eq('status', 'pending');

      // Schedule new reminders if appointment is confirmed
      if (appointment.status === 'confirmed') {
        await this.scheduleReminders(appointment);
      }
    } catch (error) {
      console.error('Error updating reminders:', error);
      throw error;
    }
  }

  async processReminders() {
    try {
      // Get due reminders
      const { data: dueReminders, error } = await supabase
        .from('reminders')
        .select('*, appointments(*)')
        .eq('status', 'pending')
        .lte('sendAt', new Date().toISOString());

      if (error) throw error;

      // Process each reminder
      for (const reminder of dueReminders) {
        try {
          await this.sendReminder(reminder);
          
          // Update reminder status
          await supabase
            .from('reminders')
            .update({ status: 'sent' })
            .eq('id', reminder.id);
        } catch (error) {
          console.error(`Error processing reminder ${reminder.id}:`, error);
          
          // Mark reminder as failed
          await supabase
            .from('reminders')
            .update({ 
              status: 'failed',
              error: error.message
            })
            .eq('id', reminder.id);
        }
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
      throw error;
    }
  }

  private async sendReminder(reminder: any) {
    const appointment = reminder.appointments;
    const { data: appointmentType } = await supabase
      .from('appointment_types')
      .select('*')
      .eq('id', appointment.appointmentTypeId)
      .single();

    const { data: customer } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', appointment.customerId)
      .single();

    const { data: host } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', appointmentType.hostId)
      .single();

    const startTime = new Date(appointment.startTime);
    const formattedDate = startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    switch (reminder.type) {
      case 'initial':
        await notificationService.sendEmail(
          customer.email,
          `Reminder: Upcoming Appointment - ${appointmentType.name}`,
          `
            This is a reminder for your upcoming appointment:
            
            ${appointmentType.name} with ${host.full_name}
            Date: ${formattedDate}
            Time: ${formattedTime}
            
            ${appointmentType.locationOptions.includes('online')
              ? appointment.meetingLink
                ? `Join the meeting: ${appointment.meetingLink}`
                : 'A meeting link will be provided soon.'
              : 'This is an in-person meeting.'}
            
            If you need to make any changes, please contact us as soon as possible.
          `
        );
        break;

      case 'followUp':
        await notificationService.sendEmail(
          customer.email,
          `Final Reminder: Appointment Today - ${appointmentType.name}`,
          `
            Your appointment is coming up in ${this.defaultSettings.followUpReminder} hours:
            
            ${appointmentType.name} with ${host.full_name}
            Time: ${formattedTime}
            
            ${appointmentType.locationOptions.includes('online')
              ? appointment.meetingLink
                ? `Join the meeting: ${appointment.meetingLink}`
                : 'A meeting link will be provided soon.'
              : 'This is an in-person meeting.'}
          `
        );
        break;

      case 'host':
        await notificationService.sendEmail(
          host.email,
          `Upcoming Appointment - ${appointmentType.name}`,
          `
            You have an appointment in ${this.defaultSettings.hostReminder} hour:
            
            ${appointmentType.name} with ${customer.full_name}
            Time: ${formattedTime}
            
            ${appointmentType.locationOptions.includes('online')
              ? appointment.meetingLink
                ? `Join the meeting: ${appointment.meetingLink}`
                : 'Remember to set up and share the meeting link.'
              : 'This is an in-person meeting.'}
          `
        );
        break;
    }
  }

  private async getReminderSettings(hostId: string): Promise<ReminderSettings> {
    try {
      const { data } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('hostId', hostId)
        .single();

      return data || this.defaultSettings;
    } catch (error) {
      console.error('Error getting reminder settings:', error);
      return this.defaultSettings;
    }
  }
}

export const reminderService = new ReminderService(); 