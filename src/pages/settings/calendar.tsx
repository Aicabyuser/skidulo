import { GoogleCalendarButton } from '@/components/calendar/GoogleCalendarButton'

export default function CalendarSettings() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Calendar Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Calendar Integration</h2>
          <p className="text-muted-foreground mb-4">
            Connect your Google Calendar to sync your appointments and manage your schedule.
          </p>
          <GoogleCalendarButton />
        </div>
      </div>
    </div>
  )
} 