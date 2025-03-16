
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarIcon, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  handleTimeSelect: (time: string) => void;
  timeSlots: string[] | undefined;
  isLoadingSlots: boolean;
  handleContinue: () => void;
  showForm: boolean;
}

const DateTimeSelector = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  handleTimeSelect,
  timeSlots,
  isLoadingSlots,
  handleContinue,
  showForm
}: DateTimeSelectorProps) => {
  return (
    <Card className="backdrop-blur-md bg-card/60 border-highlight-blue/10 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground">Select Date & Time</CardTitle>
            <CardDescription>Choose a date and available time slot for your session</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-highlight-purple gap-1"
            onClick={() => {
              if (timeSlots && timeSlots.length > 0) {
                const recommendedIndex = Math.floor(Math.random() * timeSlots.length);
                handleTimeSelect(timeSlots[recommendedIndex]);
                toast.success("AI has selected a recommended time slot for you!");
              } else {
                toast.error("No available time slots to recommend");
              }
            }}
          >
            <Sparkles className="h-4 w-4" />
            Auto-select
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex flex-col md:flex-row">
          <div className="mb-6 md:mb-0 md:mr-6 md:w-1/2">
            <div className="text-sm font-medium mb-2">Date</div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md p-3 pointer-events-auto"
              disabled={(date) => {
                const day = date.getDay();
                return date < new Date(new Date().setHours(0, 0, 0, 0)) || day === 0 || day === 6;
              }}
            />
          </div>
          <div className="md:w-1/2">
            <div className="text-sm font-medium mb-2">Available Times</div>
            {isLoadingSlots ? (
              <div className="grid grid-cols-2 gap-2 animate-pulse">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-secondary h-10 rounded-md"></div>
                ))}
              </div>
            ) : timeSlots && timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className={`transition-colors justify-center ${
                      selectedTime === time 
                        ? "bg-highlight-blue/10 border-highlight-blue text-highlight-blue" 
                        : "hover:border-highlight-blue/50 hover:text-highlight-blue"
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="mx-auto h-10 w-10 mb-2 opacity-20" />
                <p>No available time slots for this date</p>
                <p className="text-sm mt-1">Please select another date</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        {!showForm && (
          <Button 
            disabled={!selectedTime} 
            onClick={handleContinue}
            className="rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90"
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DateTimeSelector;
