import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AppointmentType } from '@/lib/types/calendar';
import { calendarService } from '@/lib/services/calendar';
import AppointmentTypeDialog from '@/components/calendar/AppointmentTypeDialog';
import AppointmentTypeList from '@/components/calendar/AppointmentTypeList';
import CalendarView from '@/components/calendar/CalendarView';
import { toast } from 'sonner';

export default function Calendar() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [isCreateTypeDialogOpen, setIsCreateTypeDialogOpen] = useState(false);

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  const loadAppointmentTypes = async () => {
    try {
      const types = await calendarService.getAppointmentTypes();
      setAppointmentTypes(types);
    } catch (error) {
      console.error('Error loading appointment types:', error);
      toast.error('Failed to load appointment types');
    }
  };

  const handleCreateAppointmentType = async (data: Omit<AppointmentType, 'id'>) => {
    try {
      await calendarService.createAppointmentType(data);
      toast.success('Appointment type created successfully');
      loadAppointmentTypes();
      setIsCreateTypeDialogOpen(false);
    } catch (error) {
      console.error('Error creating appointment type:', error);
      toast.error('Failed to create appointment type');
    }
  };

  const handleUpdateAppointmentType = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      await calendarService.updateAppointmentType(id, updates);
      toast.success('Appointment type updated successfully');
      loadAppointmentTypes();
    } catch (error) {
      console.error('Error updating appointment type:', error);
      toast.error('Failed to update appointment type');
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={() => setIsCreateTypeDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment Type
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="types">Appointment Types</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <Card className="p-4">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </Card>

            <CalendarView
              date={selectedDate}
              appointmentTypes={appointmentTypes}
            />
          </div>
        </TabsContent>

        <TabsContent value="types">
          <AppointmentTypeList
            appointmentTypes={appointmentTypes}
            onUpdate={handleUpdateAppointmentType}
          />
        </TabsContent>
      </Tabs>

      <AppointmentTypeDialog
        open={isCreateTypeDialogOpen}
        onOpenChange={setIsCreateTypeDialogOpen}
        onSubmit={handleCreateAppointmentType}
      />
    </div>
  );
} 