import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: {
      newBooking: true,
      bookingReminder: true,
      bookingCancellation: true,
      bookingModification: true,
    },
    push: {
      newBooking: false,
      bookingReminder: false,
      bookingCancellation: false,
      bookingModification: false,
    },
    sms: {
      newBooking: false,
      bookingReminder: false,
      bookingCancellation: false,
      bookingModification: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement notification settings update logic
      toast.success('Notification settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update notification settings');
      console.error(error);
    }
  };

  const NotificationSection = ({ title, type }: { title: string; type: 'email' | 'push' | 'sms' }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-new-booking`}>New Booking Notifications</Label>
          <Switch
            id={`${type}-new-booking`}
            checked={notifications[type].newBooking}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                [type]: { ...notifications[type], newBooking: checked },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-reminder`}>Booking Reminders</Label>
          <Switch
            id={`${type}-reminder`}
            checked={notifications[type].bookingReminder}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                [type]: { ...notifications[type], bookingReminder: checked },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-cancellation`}>Booking Cancellations</Label>
          <Switch
            id={`${type}-cancellation`}
            checked={notifications[type].bookingCancellation}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                [type]: { ...notifications[type], bookingCancellation: checked },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor={`${type}-modification`}>Booking Modifications</Label>
          <Switch
            id={`${type}-modification`}
            checked={notifications[type].bookingModification}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                [type]: { ...notifications[type], bookingModification: checked },
              })
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose how you want to be notified about your bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <NotificationSection title="Email Notifications" type="email" />
          <NotificationSection title="Push Notifications" type="push" />
          <NotificationSection title="SMS Notifications" type="sms" />

          <div className="flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
} 