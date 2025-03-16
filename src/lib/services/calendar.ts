import { supabase } from '@/lib/supabase';
import { 
  AppointmentType, 
  Appointment, 
  CalendarProvider, 
  TimeSlot, 
  DayAvailability,
  AvailabilitySettings 
} from '@/lib/types/calendar';
import { notificationService } from './notification';
import { googleCalendarService } from './google-calendar';
import { reminderService } from './reminder';

class CalendarService {
  // Calendar Provider Management
  async connectGoogleCalendar(code: string) {
    try {
      const tokens = await googleCalendarService.exchangeCode(code);
      
      // Save calendar provider to database
      const { data, error } = await supabase
        .from('calendar_providers')
        .insert({
          provider: 'google',
          email: tokens.email,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          expires_at: tokens.expiresAt
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      throw error;
    }
  }

  async connectMicrosoftCalendar(code: string) {
    try {
      // TODO: Exchange code for tokens using Microsoft OAuth
      const tokens = await this.exchangeMicrosoftCode(code);
      
      // Save calendar provider to database
      const { data, error } = await supabase
        .from('calendar_providers')
        .insert({
          provider: 'microsoft',
          email: tokens.email,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          expires_at: tokens.expiresAt
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error connecting Microsoft Calendar:', error);
      throw error;
    }
  }

  // Appointment Types Management
  async createAppointmentType(appointmentType: Omit<AppointmentType, 'id'>) {
    const { data, error } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAppointmentType(id: string, updates: Partial<AppointmentType>) {
    const { data, error } = await supabase
      .from('appointment_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAppointmentTypes() {
    const { data, error } = await supabase
      .from('appointment_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  // Appointments Management
  async createAppointment(appointment: Omit<Appointment, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select('*')
        .single();

      if (error) throw error;

      // Schedule reminders if appointment is confirmed
      if (data.status === 'confirmed') {
        await reminderService.scheduleReminders(data);
      }

      // Send notifications
      await notificationService.sendAppointmentNotification('created', data);

      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Update reminders based on new status
      await reminderService.updateReminders(data);

      // Send notifications
      await notificationService.sendAppointmentNotification(status === 'confirmed' ? 'confirmed' : 'cancelled', data);

      return data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  async getAppointments(filters?: {
    status?: Appointment['status'];
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase
      .from('appointments')
      .select('*, appointment_types(*)');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.startDate) {
      query = query.gte('start_time', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('end_time', filters.endDate);
    }

    const { data, error } = await query.order('start_time');
    if (error) throw error;
    return data;
  }

  // Availability Management
  async saveAvailabilitySettings(settings: AvailabilitySettings) {
    const { data, error } = await supabase
      .from('availability_settings')
      .upsert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAvailabilitySettings() {
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async getAvailableTimeSlots(date: string, appointmentTypeId: string) {
    try {
      // Get appointment type duration
      const { data: appointmentType } = await supabase
        .from('appointment_types')
        .select('duration')
        .eq('id', appointmentTypeId)
        .single();

      if (!appointmentType) throw new Error('Appointment type not found');

      // Get availability settings
      const availabilitySettings = await this.getAvailabilitySettings();
      const dayOfWeek = new Date(date).getDay();
      const daySchedule = availabilitySettings.weeklySchedule.find(
        (schedule) => schedule.dayOfWeek === dayOfWeek
      );

      if (!daySchedule || !daySchedule.isAvailable) {
        return [];
      }

      // Get existing appointments
      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('status', 'confirmed')
        .gte('start_time', `${date}T00:00:00`)
        .lte('end_time', `${date}T23:59:59`);

      // Check if date is in blackout dates
      const isBlackoutDate = availabilitySettings.blackoutDates?.some(
        (blackoutDate) => blackoutDate === date
      );

      if (isBlackoutDate) {
        return [];
      }

      // Calculate available time slots
      const slots: TimeSlot[] = [];
      const slotDuration = appointmentType.duration;
      let currentTime = new Date(`${date}T${daySchedule.startTime}`);
      const endTime = new Date(`${date}T${daySchedule.endTime}`);

      // Add buffer time to start
      if (availabilitySettings.bufferTimeBefore) {
        currentTime = new Date(currentTime.getTime() + availabilitySettings.bufferTimeBefore * 60000);
      }

      // Check minimum notice period
      const now = new Date();
      const minimumNoticeTime = new Date(
        now.getTime() + (availabilitySettings.minimumNotice || 0) * 60000
      );

      // Check maximum advance booking period
      const maximumAdvanceDate = availabilitySettings.maximumAdvance
        ? new Date(now.getTime() + availabilitySettings.maximumAdvance * 24 * 60 * 60 * 1000)
        : null;

      if (maximumAdvanceDate && new Date(date) > maximumAdvanceDate) {
        return [];
      }

      while (currentTime < endTime) {
        const slotEndTime = new Date(currentTime.getTime() + slotDuration * 60000);
        
        // Add buffer time after
        const nextSlotStart = new Date(
          slotEndTime.getTime() + (availabilitySettings.bufferTimeAfter || 0) * 60000
        );

        // Check if slot is available
        const isAvailable = !existingAppointments?.some((appointment) => {
          const appointmentStart = new Date(appointment.start_time);
          const appointmentEnd = new Date(appointment.end_time);
          return (
            (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
            (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd)
          );
        });

        // Check if slot is in the future and respects minimum notice period
        if (isAvailable && currentTime > minimumNoticeTime) {
          slots.push({
            startTime: currentTime.toISOString(),
            endTime: slotEndTime.toISOString(),
            isAvailable: true,
          });
        }

        currentTime = nextSlotStart;
      }

      return slots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }

  // Private helper methods
  private async exchangeGoogleCode(code: string) {
    // TODO: Implement Google OAuth code exchange
    return {
      email: '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0
    };
  }

  private async exchangeMicrosoftCode(code: string) {
    // TODO: Implement Microsoft OAuth code exchange
    return {
      email: '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0
    };
  }

  private async sendAppointmentNotifications(
    type: 'created' | 'updated' | 'cancelled',
    appointment: Appointment
  ) {
    // TODO: Implement notification sending
    // - Email notifications
    // - Push notifications
    // - SMS notifications (if enabled)
  }
}

export const calendarService = new CalendarService(); 