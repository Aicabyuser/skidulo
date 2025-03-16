import { format } from 'date-fns';
import { Appointment } from '@/lib/types/calendar';

const escapeCSVValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportAppointmentsToCSV = (appointments: Appointment[]): void => {
  const headers = [
    'Type',
    'Status',
    'Date',
    'Start Time',
    'End Time',
    'Duration',
    'Customer Name',
    'Customer Email',
    'Location Type',
    'Meeting Link',
    'Notes'
  ];

  const rows = appointments.map(appointment => [
    appointment.type,
    appointment.status,
    format(new Date(appointment.date), 'yyyy-MM-dd'),
    format(new Date(appointment.startTime), 'HH:mm'),
    format(new Date(appointment.endTime), 'HH:mm'),
    `${appointment.duration} minutes`,
    appointment.customer.name,
    appointment.customer.email,
    appointment.locationType,
    appointment.meetingLink || '',
    appointment.notes || ''
  ].map(value => escapeCSVValue(String(value))));

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 