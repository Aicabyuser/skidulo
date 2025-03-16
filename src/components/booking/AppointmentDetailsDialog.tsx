import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/lib/types/calendar';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Mail,
  Phone,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onStatusUpdate: (id: string, status: Appointment['status']) => Promise<void>;
}

export default function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onStatusUpdate,
}: AppointmentDetailsDialogProps) {
  const startTime = parseISO(appointment.startTime);
  const endTime = parseISO(appointment.endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            View and manage appointment information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div>
            <h3 className="font-semibold text-lg">
              {appointment.appointment_types.name}
            </h3>
            <p className="text-muted-foreground">
              {appointment.appointment_types.description}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Date & Time</div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {format(startTime, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Location</div>
                <div className="flex items-center gap-2 text-sm">
                  {appointment.appointment_types.locationOptions.includes('online') ? (
                    <>
                      <Video className="h-4 w-4" />
                      {appointment.meetingLink ? (
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        'Online meeting (link will be provided)'
                      )}
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      In-person meeting
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Customer Information</div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    {appointment.customer?.full_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {appointment.customer?.email}
                  </div>
                  {appointment.customer?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {appointment.customer.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Appointment Details</div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    Duration: {appointment.appointment_types.duration} minutes
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    Price: ${appointment.appointment_types.price}
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 mt-0.5" />
                      <div>{appointment.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {appointment.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
                >
                  Confirm Appointment
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
                >
                  Cancel Appointment
                </Button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <Button
                variant="destructive"
                onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
              >
                Cancel Appointment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 