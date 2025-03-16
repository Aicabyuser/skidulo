import { Appointment } from '@/lib/types/calendar';
import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  url?: string;
}

function formatGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    dates: `${format(new Date(event.startTime), "yyyyMMdd'T'HHmmss'Z'")}/${format(
      new Date(event.endTime),
      "yyyyMMdd'T'HHmmss'Z'"
    )}`,
  });

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    startdt: format(new Date(event.startTime), 'yyyy-MM-dd HH:mm:ss'),
    enddt: format(new Date(event.endTime), 'yyyy-MM-dd HH:mm:ss'),
  });

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function generateICSFile(events: CalendarEvent[]): string {
  const formatICSDate = (date: string) =>
    format(new Date(date), "yyyyMMdd'T'HHmmss'Z'");

  const icsEvents = events
    .map(
      (event) => `BEGIN:VEVENT
DTSTART:${formatICSDate(event.startTime)}
DTEND:${formatICSDate(event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
${event.location ? `LOCATION:${event.location}\n` : ''}
${event.url ? `URL:${event.url}\n` : ''}
END:VEVENT`
    )
    .join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AiCabY//Calendar Export//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsEvents}
END:VCALENDAR`;
}

export function addToCalendar(
  appointments: Appointment[],
  format: 'google' | 'ics' | 'outlook'
): void {
  const events: CalendarEvent[] = appointments.map((appointment) => ({
    title: `${appointment.appointment_types.name} - ${appointment.customer.name}`,
    description: `Appointment Details:
Type: ${appointment.appointment_types.name}
Customer: ${appointment.customer.name}
Email: ${appointment.customer.email}
Phone: ${appointment.customer.phone}
Status: ${appointment.status}
${appointment.notes ? `\nNotes: ${appointment.notes}` : ''}`,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    location: appointment.location_type === 'online' ? 'Online Meeting' : appointment.location,
    url: appointment.location_type === 'online' ? appointment.meeting_link : undefined,
  }));

  switch (format) {
    case 'google':
      // Open Google Calendar in a new tab for each event
      events.forEach((event) => {
        window.open(formatGoogleCalendarUrl(event), '_blank');
      });
      break;

    case 'outlook':
      // Open Outlook Calendar in a new tab for each event
      events.forEach((event) => {
        window.open(formatOutlookCalendarUrl(event), '_blank');
      });
      break;

    case 'ics':
      // Generate and download ICS file
      const icsContent = generateICSFile(events);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `appointments-${format(new Date(), 'yyyy-MM-dd')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      break;
  }
} 