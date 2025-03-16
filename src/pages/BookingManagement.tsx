import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react';
import { calendarService } from '@/lib/services/calendar';
import { toast } from 'sonner';
import { Appointment } from '@/lib/types/calendar';
import AppointmentDetailsDialog from '@/components/booking/AppointmentDetailsDialog';
import CalendarView from '@/components/calendar/CalendarView';
import BatchActionsBar from '@/components/booking/BatchActionsBar';
import { exportAppointmentsToCSV } from '@/lib/utils/export';

export default function BookingManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await calendarService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    try {
      await calendarService.updateAppointmentStatus(id, status);
      toast.success('Appointment status updated successfully');
      loadAppointments();
      setIsDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleBatchStatusUpdate = async (status: Appointment['status']) => {
    try {
      const updatePromises = Array.from(selectedAppointments).map((id) =>
        calendarService.updateAppointmentStatus(id, status)
      );

      await Promise.all(updatePromises);
      toast.success('Selected appointments updated successfully');
      loadAppointments();
      setSelectedAppointments(new Set());
    } catch (error) {
      console.error('Error updating appointments:', error);
      toast.error('Failed to update some appointments');
    }
  };

  const handleExport = () => {
    const selectedAppointmentsList = appointments.filter((appointment) =>
      selectedAppointments.has(appointment.id)
    );
    exportAppointmentsToCSV(selectedAppointmentsList);
  };

  const toggleAppointmentSelection = (appointmentId: string) => {
    const newSelection = new Set(selectedAppointments);
    if (newSelection.has(appointmentId)) {
      newSelection.delete(appointmentId);
    } else {
      newSelection.add(appointmentId);
    }
    setSelectedAppointments(newSelection);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const badges = {
      pending: (
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertCircle className="h-4 w-4" />
          Pending
        </div>
      ),
      confirmed: (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Confirmed
        </div>
      ),
      cancelled: (
        <div className="flex items-center gap-1 text-red-600">
          <XCircle className="h-4 w-4" />
          Cancelled
        </div>
      ),
    };
    return badges[status];
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const startTime = parseISO(appointment.startTime);
    const endTime = parseISO(appointment.endTime);

    return (
      <Card key={appointment.id} className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={selectedAppointments.has(appointment.id)}
              onCheckedChange={() => toggleAppointmentSelection(appointment.id)}
            />
            <div>
              <h3 className="font-semibold">
                {appointment.appointment_types.name}
              </h3>
              <div className="text-sm text-muted-foreground">
                {appointment.appointment_types.description}
              </div>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(startTime, 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
          </div>
          <div className="flex items-center gap-2">
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
                  'Online meeting'
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAppointment(appointment);
              setIsDetailsDialogOpen(true);
            }}
          >
            View Details
          </Button>
          {appointment.status === 'pending' && (
            <>
              <Button
                variant="default"
                onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
              >
                Confirm
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
              >
                Cancel
              </Button>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>
    );
  };

  const filterAppointments = (status?: Appointment['status']) => {
    if (!status) return appointments;
    return appointments.filter((appointment) => appointment.status === status);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading appointments...</div>;
  }

  const selectedAppointmentsList = appointments.filter((appointment) =>
    selectedAppointments.has(appointment.id)
  );

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your appointment bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              List View
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </Button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments found
                </div>
              ) : (
                appointments.map(renderAppointmentCard)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterAppointments('pending').map(renderAppointmentCard)}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              {filterAppointments('confirmed').map(renderAppointmentCard)}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {filterAppointments('cancelled').map(renderAppointmentCard)}
            </TabsContent>
          </Tabs>
        ) : (
          <CalendarView onStatusUpdate={handleStatusUpdate} />
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          appointment={selectedAppointment}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <BatchActionsBar
        selectedAppointments={selectedAppointmentsList}
        onBatchStatusUpdate={handleBatchStatusUpdate}
        onExport={handleExport}
        onClearSelection={() => setSelectedAppointments(new Set())}
      />
    </div>
  );
} 