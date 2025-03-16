import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar as LucideCalendar, Clock } from 'lucide-react';

const availabilityFormSchema = z.object({
  defaultBufferBefore: z.number().min(0).max(120),
  defaultBufferAfter: z.number().min(0).max(120),
  minimumNotice: z.number().min(0),
  maximumAdvance: z.number().min(1),
  defaultAvailability: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    isAvailable: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  })),
});

type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

const defaultWorkingHours = [
  { day: 'monday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
  { day: 'tuesday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
  { day: 'wednesday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
  { day: 'thursday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
  { day: 'friday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
  { day: 'saturday', isAvailable: false, startTime: '09:00', endTime: '17:00' },
  { day: 'sunday', isAvailable: false, startTime: '09:00', endTime: '17:00' },
];

export default function CalendarSettings() {
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [connectedCalendars, setConnectedCalendars] = React.useState<string[]>([]);
  const { user } = useAuth();
  const [calendarIntegrations, setCalendarIntegrations] = React.useState({
    google: false,
    microsoft: false,
  });
  const [settings, setSettings] = React.useState({
    bufferTime: 15,
    minimumNotice: 24,
    defaultMeetingDuration: 30,
    autoAcceptBookings: false,
    showAvailabilityPublicly: true,
  });

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      defaultBufferBefore: 15,
      defaultBufferAfter: 15,
      minimumNotice: 24,
      maximumAdvance: 90,
      defaultAvailability: defaultWorkingHours,
    },
  });

  const handleCalendarConnect = async (service: string) => {
    try {
      // TODO: Implement OAuth flow for calendar service
      toast({
        title: "Connecting Calendar",
        description: `Initiating connection to ${service}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBlackoutDate = (date: Date) => {
    setSelectedDates((current) => {
      const exists = current.find(
        (d) => d.toDateString() === date.toDateString()
      );
      if (exists) {
        return current.filter((d) => d.toDateString() !== date.toDateString());
      }
      return [...current, date];
    });
  };

  const handleGoogleCalendarConnect = async () => {
    try {
      // TODO: Implement Google Calendar OAuth
      setCalendarIntegrations({ ...calendarIntegrations, google: true });
      toast.success('Google Calendar connected successfully!');
    } catch (error) {
      toast.error('Failed to connect Google Calendar');
      console.error(error);
    }
  };

  const handleMicrosoftCalendarConnect = async () => {
    try {
      // TODO: Implement Microsoft Calendar OAuth
      setCalendarIntegrations({ ...calendarIntegrations, microsoft: true });
      toast.success('Microsoft Calendar connected successfully!');
    } catch (error) {
      toast.error('Failed to connect Microsoft Calendar');
      console.error(error);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement settings update logic
      toast.success('Calendar settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update calendar settings');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Connected Calendars</CardTitle>
          <CardDescription>
            Connect your calendars to automatically sync your availability and prevent double bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.google className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  Sync events from your Google Calendar
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleCalendarConnect("Google Calendar")}>
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.microsoft className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Microsoft Outlook</h4>
                <p className="text-sm text-muted-foreground">
                  Sync events from your Outlook Calendar
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleCalendarConnect("Microsoft Outlook")}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Buffer Times</CardTitle>
              <CardDescription>
                Set default buffer times between appointments to prepare for meetings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="defaultBufferBefore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buffer Before (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={120}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultBufferAfter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buffer After (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={120}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>
                Configure when clients can book appointments with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimumNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Notice (hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        How much notice you need before a booking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximumAdvance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Advance (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        How far in advance clients can book
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Working Hours</CardTitle>
              <CardDescription>
                Set your regular working hours for each day of the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {defaultWorkingHours.map((day, index) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <p className="text-sm font-medium capitalize">{day.day}</p>
                      </div>
                      <Switch
                        checked={form.watch(`defaultAvailability.${index}.isAvailable`)}
                        onCheckedChange={(checked) => {
                          form.setValue(`defaultAvailability.${index}.isAvailable`, checked);
                        }}
                      />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Input
                          type="time"
                          value={form.watch(`defaultAvailability.${index}.startTime`)}
                          onChange={(e) => {
                            form.setValue(`defaultAvailability.${index}.startTime`, e.target.value);
                          }}
                          disabled={!form.watch(`defaultAvailability.${index}.isAvailable`)}
                        />
                        <Input
                          type="time"
                          value={form.watch(`defaultAvailability.${index}.endTime`)}
                          onChange={(e) => {
                            form.setValue(`defaultAvailability.${index}.endTime`, e.target.value);
                          }}
                          disabled={!form.watch(`defaultAvailability.${index}.isAvailable`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blackout Dates</CardTitle>
              <CardDescription>
                Select dates when you're unavailable for bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(date) => date && handleBlackoutDate(date)}
                  className="rounded-md border"
                />
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date) => (
                    <Badge
                      key={date.toISOString()}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleBlackoutDate(date)}
                    >
                      {date.toLocaleDateString()}
                      <Icons.x className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit">Save Calendar Settings</Button>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Settings</CardTitle>
          <CardDescription>
            Manage your calendar integrations and booking preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Calendar Integrations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Calendar Integrations</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <LucideCalendar className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <p className="text-sm text-muted-foreground">
                      {calendarIntegrations.google ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={calendarIntegrations.google ? "outline" : "default"}
                  onClick={handleGoogleCalendarConnect}
                >
                  {calendarIntegrations.google ? 'Disconnect' : 'Connect'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <LucideCalendar className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium">Microsoft Calendar</p>
                    <p className="text-sm text-muted-foreground">
                      {calendarIntegrations.microsoft ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={calendarIntegrations.microsoft ? "outline" : "default"}
                  onClick={handleMicrosoftCalendarConnect}
                >
                  {calendarIntegrations.microsoft ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Preferences */}
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold">Booking Preferences</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
                <Input
                  id="bufferTime"
                  type="number"
                  value={settings.bufferTime}
                  onChange={(e) => setSettings({ ...settings, bufferTime: parseInt(e.target.value) })}
                  min="0"
                  max="60"
                />
                <p className="text-sm text-muted-foreground">
                  Add buffer time between meetings
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minimumNotice">Minimum Notice (hours)</Label>
                <Input
                  id="minimumNotice"
                  type="number"
                  value={settings.minimumNotice}
                  onChange={(e) => setSettings({ ...settings, minimumNotice: parseInt(e.target.value) })}
                  min="0"
                  max="72"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum notice required for new bookings
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="defaultDuration">Default Meeting Duration (minutes)</Label>
                <Input
                  id="defaultDuration"
                  type="number"
                  value={settings.defaultMeetingDuration}
                  onChange={(e) => setSettings({ ...settings, defaultMeetingDuration: parseInt(e.target.value) })}
                  min="15"
                  max="240"
                  step="15"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-accept Bookings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically accept new booking requests
                  </p>
                </div>
                <Switch
                  checked={settings.autoAcceptBookings}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoAcceptBookings: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Availability</Label>
                  <p className="text-sm text-muted-foreground">
                    Show your availability publicly
                  </p>
                </div>
                <Switch
                  checked={settings.showAvailabilityPublicly}
                  onCheckedChange={(checked) => setSettings({ ...settings, showAvailabilityPublicly: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 