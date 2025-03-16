import { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  addDays,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
} from 'lucide-react';
import { calendarService } from '@/lib/services/calendar';
import { Appointment, AppointmentType } from '@/lib/types/calendar';
import AppointmentDetailsDialog from '@/components/booking/AppointmentDetailsDialog';
import WeekDayView from './WeekDayView';
import { toast } from 'sonner';
import { exportAppointmentsToCSV } from '@/lib/utils/export';
import { addToCalendar } from '@/lib/utils/calendar-export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { notificationService } from '@/lib/services/notification';

interface CalendarViewProps {
  onStatusUpdate: (id: string, status: Appointment['status']) => Promise<void>;
}

type ViewMode = 'month' | 'week' | 'day';

interface AdvancedFilters {
  dateRange: { from: Date | undefined; to: Date | undefined };
  search: string;
  status: string[];
  types: string[];
}

export default function CalendarView({ onStatusUpdate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    dateRange: { from: undefined, to: undefined },
    search: '',
    status: [],
    types: [],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadAppointmentTypes();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      const startDate = format(
        viewMode === 'month' ? startOfMonth(currentDate) : currentDate,
        'yyyy-MM-dd'
      );
      const endDate = format(
        viewMode === 'month'
          ? endOfMonth(currentDate)
          : viewMode === 'week'
          ? addDays(currentDate, 6)
          : currentDate,
        'yyyy-MM-dd'
      );
      
      const data = await calendarService.getAppointments({
        startDate,
        endDate,
      });

      // Apply advanced filters
      const filteredData = data.filter((appointment) => {
        const statusMatch =
          filters.status === 'all' || appointment.status === filters.status;
        const typeMatch =
          filters.type === 'all' ||
          appointment.appointment_types.id === filters.type;
          
        const searchMatch = !advancedFilters.search || 
          appointment.customer.name.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          appointment.appointment_types.name.toLowerCase().includes(advancedFilters.search.toLowerCase());
          
        const dateRangeMatch = !advancedFilters.dateRange.from || !advancedFilters.dateRange.to ||
          (new Date(appointment.startTime) >= advancedFilters.dateRange.from &&
           new Date(appointment.startTime) <= advancedFilters.dateRange.to);
           
        const advancedStatusMatch = !advancedFilters.status.length ||
          advancedFilters.status.includes(appointment.status);
          
        const advancedTypeMatch = !advancedFilters.types.length ||
          advancedFilters.types.includes(appointment.appointment_types.id);

        return statusMatch && typeMatch && searchMatch && 
               dateRangeMatch && advancedStatusMatch && advancedTypeMatch;
      });

      setAppointments(filteredData);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentTypes = async () => {
    try {
      const types = await calendarService.getAppointmentTypes();
      setAppointmentTypes(types);
    } catch (error) {
      console.error('Error loading appointment types:', error);
    }
  };

  const handleAppointmentReschedule = async (
    appointmentId: string,
    newStartTime: string
  ) => {
    try {
      const appointment = appointments.find((a) => a.id === appointmentId);
      if (!appointment) return;

      // Calculate new end time based on appointment duration
      const endTime = new Date(
        new Date(newStartTime).getTime() +
          appointment.appointment_types.duration * 60000
      ).toISOString();

      await calendarService.updateAppointment(appointmentId, {
        startTime: newStartTime,
        endTime,
      });

      toast.success('Appointment rescheduled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error('Failed to reschedule appointment');
    }
  };

  const handleExportToCalendar = (format: 'google' | 'ics' | 'outlook') => {
    addToCalendar(appointments, format);
  };

  const handleExportToCSV = () => {
    exportAppointmentsToCSV(appointments);
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    await onStatusUpdate(id, status);
    setIsDetailsDialogOpen(false);
    loadAppointments();
  };

  const getDayAppointments = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.startTime), date)
    );
  };

  const renderAppointmentBadge = (appointment: Appointment) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <div
        key={appointment.id}
        className={`flex items-center gap-1 p-1 rounded-md text-xs cursor-pointer ${
          statusColors[appointment.status]
        }`}
        onClick={() => {
          setSelectedAppointment(appointment);
          setIsDetailsDialogOpen(true);
        }}
      >
        <Clock className="h-3 w-3" />
        <span>
          {format(parseISO(appointment.startTime), 'HH:mm')} -{' '}
          {appointment.appointment_types.name}
        </span>
      </div>
    );
  };

  const renderDay = (date: Date) => {
    const dayAppointments = getDayAppointments(date);
    const isCurrentMonth = isSameMonth(date, currentDate);

    return (
      <div
        key={date.toISOString()}
        className={`min-h-[120px] p-2 border-r border-b ${
          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <div className="font-medium text-sm mb-1">
          {format(date, 'd')}
        </div>
        <div className="space-y-1">
          {dayAppointments.map(renderAppointmentBadge)}
        </div>
      </div>
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add new functions for batch operations
  const handleSelectAll = () => {
    const newSelected = new Set(appointments.map(appointment => appointment.id));
    setSelectedAppointments(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedAppointments(new Set());
  };

  const handleBulkStatusUpdate = async (status: Appointment['status']) => {
    try {
      const promises = Array.from(selectedAppointments).map(id =>
        onStatusUpdate(id, status)
      );
      await Promise.all(promises);
      
      // Send bulk notifications
      const updatedAppointments = appointments.filter(app => 
        selectedAppointments.has(app.id)
      );
      await notificationService.sendBulkStatusUpdateNotifications(
        updatedAppointments,
        status
      );
      
      toast.success(`Successfully updated ${selectedAppointments.size} appointments`);
      setSelectedAppointments(new Set());
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointments:', error);
      toast.error('Failed to update some appointments');
    }
  };

  const handleExportSelected = (format: 'csv' | 'excel' | 'pdf') => {
    const selectedApps = appointments.filter(app => 
      selectedAppointments.has(app.id)
    );
    
    switch (format) {
      case 'csv':
        exportAppointmentsToCSV(selectedApps);
        break;
      case 'excel':
        exportAppointmentsToExcel(selectedApps);
        break;
      case 'pdf':
        exportAppointmentsToPDF(selectedApps);
        break;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading appointments...</div>;
  }

  if (viewMode !== 'month') {
    return (
      <WeekDayView
        currentDate={currentDate}
        appointments={appointments}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onAppointmentReschedule={handleAppointmentReschedule}
        onAppointmentClick={(appointment) => {
          setSelectedAppointment(appointment);
          setIsDetailsDialogOpen(true);
        }}
      />
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {selectedAppointments.size > 0 && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md">
              <span className="text-sm font-medium">
                {selectedAppointments.size} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
              >
                Clear
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate('confirmed')}>
                    Confirm Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate('cancelled')}>
                    Cancel Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportSelected('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportSelected('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportSelected('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            Select All
          </Button>
          <div className="flex items-center gap-2">
            <Select
              value={viewMode}
              onValueChange={(value: ViewMode) => setViewMode(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ ...filters, status: value });
                loadAppointments();
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(value) => {
                setFilters({ ...filters, type: value });
                loadAppointments();
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Appointment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) =>
                handleExportToCalendar(value as 'google' | 'ics' | 'outlook')
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Export Calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Calendar</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="ics">iCalendar (.ics)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportToCSV}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="mb-4 p-4 border rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <DateRangePicker
                value={advancedFilters.dateRange}
                onChange={(range) => {
                  setAdvancedFilters(prev => ({
                    ...prev,
                    dateRange: range
                  }));
                  loadAppointments();
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <Input
                placeholder="Search appointments..."
                value={advancedFilters.search}
                onChange={(e) => {
                  setAdvancedFilters(prev => ({
                    ...prev,
                    search: e.target.value
                  }));
                  loadAppointments();
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 border-l border-t">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 px-3 text-sm font-medium text-center border-r border-b bg-gray-50"
          >
            {day}
          </div>
        ))}
        {eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        }).map(renderDay)}
      </div>

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          appointment={selectedAppointment}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </Card>
  );
} 