import { Appointment, AppointmentType } from '@/lib/types/calendar';
import { supabase } from '@/lib/supabase';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private gapiInited = false;
  private gisInited = false;
  private isAuthorized = false;

  private constructor() {}

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  async initialize() {
    try {
      await this.loadGapiScript();
      await this.loadGisScript();
      await this.initializeGapi();
      this.initializeTokenClient();
    } catch (error) {
      console.error('Error initializing Google Calendar:', error);
      throw error;
    }
  }

  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GAPI script'));
      document.head.appendChild(script);
    });
  }

  private loadGisScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GIS script'));
      document.head.appendChild(script);
    });
  }

  private async initializeGapi(): Promise<void> {
    if (!window.gapi) throw new Error('GAPI not loaded');
    
    await new Promise<void>((resolve, reject) => {
      window.gapi.load('client', { callback: resolve, onerror: reject });
    });

    await window.gapi.client.init({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });

    this.gapiInited = true;
  }

  private initializeTokenClient() {
    if (!window.google) throw new Error('Google Identity Services not loaded');
    
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: (response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        this.isAuthorized = true;
      },
    });
    this.gisInited = true;
  }

  async authorize(): Promise<void> {
    if (!this.tokenClient) {
      throw new Error('Token client not initialized');
    }

    if (!this.gapiInited || !this.gisInited) {
      throw new Error('GAPI or GIS not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient!.callback = (response) => {
          if (response.error) {
            reject(response.error);
            return;
          }
          this.isAuthorized = true;
          resolve();
        };
        this.tokenClient!.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    });
  }

  async listEvents(calendarId = 'primary', timeMin?: Date, timeMax?: Date) {
    if (!this.isAuthorized) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.list({
      calendarId,
      timeMin: timeMin?.toISOString() || new Date().toISOString(),
      timeMax: timeMax?.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
    });

    return response.result.items;
  }

  async createEvent(event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
  }) {
    if (!this.isAuthorized) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.result;
  }

  async updateEvent(eventId: string, event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string; timeZone?: string };
    end?: { dateTime: string; timeZone?: string };
  }) {
    if (!this.isAuthorized) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: event,
    });

    return response.result;
  }

  async deleteEvent(eventId: string) {
    if (!this.isAuthorized) {
      throw new Error('Not authorized');
    }

    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }

  async createCalendarEvent(appointment: Appointment, appointmentType: AppointmentType) {
    if (!this.isAuthorized) {
      throw new Error('Not authorized');
    }

    const { data: customer } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', appointment.customerId)
      .single();

    if (!customer) {
      throw new Error('Customer not found');
    }

    const event = {
      summary: `${appointmentType.name} with ${customer.full_name}`,
      description: appointmentType.description,
      start: {
        dateTime: appointment.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: appointment.endTime,
        timeZone: 'UTC',
      },
      attendees: [
        { email: customer.email },
      ],
      conferenceData: appointmentType.locationOptions.includes('online')
        ? {
            createRequest: {
              requestId: appointment.id,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          }
        : undefined,
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    return response.result;
  }
}

export const googleCalendarService = GoogleCalendarService.getInstance();
export default googleCalendarService; 