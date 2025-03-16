import { useState, useEffect } from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  addDays,
  parseISO,
  isSameDay,
  addHours,
  setHours,
  setMinutes,
} from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Appointment } from '@/lib/types/calendar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface WeekDayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  viewMode: 'week' | 'day';
  onDateChange: (date: Date) => void;
  onAppointmentReschedule: (
    appointmentId: string,
    newStartTime: string
  ) => Promise<void>;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function WeekDayView({
  currentDate,
  appointments,
  viewMode,
  onDateChange,
  onAppointmentReschedule,
  onAppointmentClick,
}: WeekDayViewProps) {
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(
    null
  );

  const days = viewMode === 'week'
    ? eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 0 }),
        end: endOfWeek(currentDate, { weekStartsOn: 0 }),
      })
    : [currentDate];

  const hours = eachHourOfInterval({
    start: setHours(currentDate, 8), // Start at 8 AM
    end: setHours(currentDate, 20), // End at 8 PM
  });

  const getAppointmentsForDayAndHour = (day: Date, hour: Date) => {
    return appointments.filter((appointment) => {
      const startTime = parseISO(appointment.startTime);
      return (
        isSameDay(startTime, day) &&
        startTime.getHours() === hour.getHours()
      );
    });
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !draggedAppointment) return;

    const [dayIndex, hour] = result.source.droppableId.split('-');
    const [newDayIndex, newHour] = result.destination.droppableId.split('-');

    const newDay = addDays(
      startOfWeek(currentDate, { weekStartsOn: 0 }),
      parseInt(newDayIndex)
    );
    const newStartTime = setMinutes(
      setHours(newDay, parseInt(newHour)),
      0
    ).toISOString();

    await onAppointmentReschedule(draggedAppointment.id, newStartTime);
    setDraggedAppointment(null);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {viewMode === 'week'
              ? `Week of ${format(days[0], 'MMM d, yyyy')}`
              : format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onDateChange(
                addDays(currentDate, viewMode === 'week' ? -7 : -1)
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onDateChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onDateChange(
                addDays(currentDate, viewMode === 'week' ? 7 : 1)
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-4">
        <div className="w-16" /> {/* Time column header spacer */}
        <div className="grid grid-cols-{days.length} gap-2">
          {days.map((day, index) => (
            <div
              key={day.toISOString()}
              className="text-center font-medium py-2"
            >
              <div>{format(day, 'EEE')}</div>
              <div className="text-sm text-muted-foreground">
                {format(day, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        <DragDropContext
          onDragStart={(start) => {
            const appointment = appointments.find(
              (a) => a.id === start.draggableId
            );
            if (appointment) setDraggedAppointment(appointment);
          }}
          onDragEnd={handleDragEnd}
        >
          {hours.map((hour) => (
            <div key={hour.toISOString()} className="grid grid-cols-[auto,1fr]">
              <div className="w-16 text-right pr-4 py-2 text-sm text-muted-foreground">
                {format(hour, 'h a')}
              </div>
              <div className="grid grid-cols-{days.length} gap-2">
                {days.map((day, dayIndex) => (
                  <Droppable
                    key={`${dayIndex}-${hour.getHours()}`}
                    droppableId={`${dayIndex}-${hour.getHours()}`}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="h-16 border rounded-md p-1"
                      >
                        {getAppointmentsForDayAndHour(day, hour).map(
                          (appointment, index) => (
                            <Draggable
                              key={appointment.id}
                              draggableId={appointment.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => onAppointmentClick(appointment)}
                                  className={`text-xs p-1 rounded cursor-pointer ${
                                    appointment.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800'
                                      : appointment.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {appointment.appointment_types.name}
                                </div>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
    </Card>
  );
} 