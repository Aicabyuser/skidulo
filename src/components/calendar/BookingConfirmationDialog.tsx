import { format, parse } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppointmentType, TimeSlot } from '@/lib/types/calendar';
import { Clock, Calendar, MapPin, Video, DollarSign } from 'lucide-react';

interface BookingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentType: AppointmentType;
  timeSlot: TimeSlot;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export default function BookingConfirmationDialog({
  open,
  onOpenChange,
  appointmentType,
  timeSlot,
  onConfirm,
  loading = false,
}: BookingConfirmationDialogProps) {
  const startTime = parse(timeSlot.startTime, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Please review the appointment details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: appointmentType.color }}
            />
            <span className="font-medium">{appointmentType.name}</span>
          </div>

          {appointmentType.description && (
            <p className="text-sm text-muted-foreground">
              {appointmentType.description}
            </p>
          )}

          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(startTime, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {format(startTime, 'h:mm a')} ({appointmentType.duration} minutes)
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              ${appointmentType.price}
            </div>
            <div className="flex items-center gap-2">
              {appointmentType.locationOptions.includes('online') && (
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Online meeting link will be provided
                </div>
              )}
              {appointmentType.locationOptions.includes('in-person') && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  In-person meeting
                </div>
              )}
            </div>
          </div>

          {appointmentType.requiresConfirmation && (
            <div className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700">
                This appointment requires confirmation from the host. You will be notified once it's confirmed.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 