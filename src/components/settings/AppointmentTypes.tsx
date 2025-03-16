import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { appointmentTypeService } from '@/lib/services/appointment-types';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';

const appointmentTypeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().optional(),
  currency: z.string().default('USD'),
  is_group: z.boolean().default(false),
  max_participants: z.number().optional(),
  location_type: z.enum(['in_person', 'virtual', 'both']),
  in_person_location: z.string().optional(),
  virtual_meeting_url: z.string().optional(),
  color: z.string().optional(),
  requires_confirmation: z.boolean().default(false),
  booking_notice: z.number().default(24),
});

export default function AppointmentTypes() {
  const [appointmentTypes, setAppointmentTypes] = React.useState<any[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const { toast } = useToast();
  const user = useUser();

  const form = useForm<z.infer<typeof appointmentTypeSchema>>({
    resolver: zodResolver(appointmentTypeSchema),
    defaultValues: {
      currency: 'USD',
      is_group: false,
      location_type: 'virtual',
      requires_confirmation: false,
      booking_notice: 24,
    },
  });

  React.useEffect(() => {
    if (user) {
      loadAppointmentTypes();
    }
  }, [user]);

  const loadAppointmentTypes = async () => {
    try {
      const types = await appointmentTypeService.getUserAppointmentTypes(user!.id);
      setAppointmentTypes(types);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load appointment types',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof appointmentTypeSchema>) => {
    try {
      await appointmentTypeService.createAppointmentType(user!.id, data);
      toast({
        title: 'Success',
        description: 'Appointment type created successfully',
      });
      setIsCreating(false);
      loadAppointmentTypes();
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment type',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await appointmentTypeService.toggleAppointmentTypeStatus(id, !currentStatus);
      loadAppointmentTypes();
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointment Types</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Appointment Type</DialogTitle>
              <DialogDescription>
                Configure the details for your new appointment type.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="30 Minute Meeting" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="30-min-meeting" />
                      </FormControl>
                      <FormDescription>
                        This will be used in your booking URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Brief description of the meeting type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in_person">In Person</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_group"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Group Event</FormLabel>
                        <FormDescription>
                          Allow multiple participants to book the same time slot
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('is_group') && (
                  <FormField
                    control={form.control}
                    name="max_participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Participants</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit">Create Appointment Type</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointmentTypes.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{type.title}</span>
                <Switch
                  checked={type.is_active}
                  onCheckedChange={() => handleToggleStatus(type.id, type.is_active)}
                />
              </CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{type.duration} minutes</span>
                </div>
                {type.price && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span>{type.price} {type.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{type.location_type.replace('_', ' ')}</span>
                </div>
                {type.is_group && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Participants:</span>
                    <span>{type.max_participants}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 