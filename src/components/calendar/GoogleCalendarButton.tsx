import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { googleCalendarService } from '@/lib/services/google-calendar'
import { toast } from 'sonner'

export function GoogleCalendarButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      // Initialize the Google Calendar API
      await googleCalendarService.initialize()
      // Request authorization
      await googleCalendarService.authorize()
      toast.success('Successfully connected to Google Calendar')
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      toast.error('Failed to connect to Google Calendar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      variant="outline"
    >
      {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
    </Button>
  )
} 