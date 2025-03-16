import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AppointmentType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  price?: number;
  currency: string;
  is_group: boolean;
  max_participants?: number;
  location_type: 'in_person' | 'virtual' | 'both';
  in_person_location?: string;
  virtual_meeting_url?: string;
  color?: string;
  is_active: boolean;
  requires_confirmation: boolean;
  custom_questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'multiselect' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
  booking_notice: number;
}

export interface AppointmentTypeAvailability {
  id: string;
  appointment_type_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

class AppointmentTypeService {
  // Create a new appointment type
  async createAppointmentType(userId: string, appointmentType: Omit<AppointmentType, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .insert({
          user_id: userId,
          ...appointmentType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating appointment type:', error);
      throw error;
    }
  }

  // Update an existing appointment type
  async updateAppointmentType(appointmentTypeId: string, updates: Partial<AppointmentType>) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .update(updates)
        .eq('id', appointmentTypeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating appointment type:', error);
      throw error;
    }
  }

  // Delete an appointment type
  async deleteAppointmentType(appointmentTypeId: string) {
    try {
      const { error } = await supabase
        .from('appointment_types')
        .delete()
        .eq('id', appointmentTypeId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting appointment type:', error);
      throw error;
    }
  }

  // Get all appointment types for a user
  async getUserAppointmentTypes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select(`
          *,
          appointment_type_availability (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting appointment types:', error);
      throw error;
    }
  }

  // Get a single appointment type by ID
  async getAppointmentType(appointmentTypeId: string) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select(`
          *,
          appointment_type_availability (*)
        `)
        .eq('id', appointmentTypeId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting appointment type:', error);
      throw error;
    }
  }

  // Set availability for an appointment type
  async setAppointmentTypeAvailability(
    appointmentTypeId: string,
    availability: Omit<AppointmentTypeAvailability, 'id'>[]
  ) {
    try {
      // First, delete existing availability
      await supabase
        .from('appointment_type_availability')
        .delete()
        .eq('appointment_type_id', appointmentTypeId);

      // Then, insert new availability
      const { data, error } = await supabase
        .from('appointment_type_availability')
        .insert(
          availability.map(a => ({
            ...a,
            appointment_type_id: appointmentTypeId,
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting appointment type availability:', error);
      throw error;
    }
  }

  // Toggle appointment type active status
  async toggleAppointmentTypeStatus(appointmentTypeId: string, isActive: boolean) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .update({ is_active: isActive })
        .eq('id', appointmentTypeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling appointment type status:', error);
      throw error;
    }
  }

  // Update custom questions
  async updateCustomQuestions(
    appointmentTypeId: string,
    questions: AppointmentType['custom_questions']
  ) {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .update({ custom_questions: questions })
        .eq('id', appointmentTypeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating custom questions:', error);
      throw error;
    }
  }
}

export const appointmentTypeService = new AppointmentTypeService(); 