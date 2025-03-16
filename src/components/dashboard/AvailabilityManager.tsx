
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AvailabilityManagerProps {
  provider: {
    username: string;
    availability: {
      [key: string]: string[];
    };
  };
}

const weekdays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const AvailabilityManager = ({ provider }: AvailabilityManagerProps) => {
  // In a real app, this would be loaded from the API and saved back to it
  const [availability, setAvailability] = useState(provider.availability);
  const [activeDay, setActiveDay] = useState("monday");
  const [dayEnabled, setDayEnabled] = useState<{[key: string]: boolean}>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const handleToggleTimeSlot = (day: string, time: string) => {
    setAvailability(prev => {
      const newAvailability = { ...prev };
      
      if (!newAvailability[day]) {
        newAvailability[day] = [];
      }
      
      if (newAvailability[day].includes(time)) {
        newAvailability[day] = newAvailability[day].filter(t => t !== time);
      } else {
        newAvailability[day] = [...newAvailability[day], time].sort();
      }
      
      return newAvailability;
    });
  };

  const handleToggleDay = (day: string, enabled: boolean) => {
    setDayEnabled(prev => ({
      ...prev,
      [day]: enabled
    }));
    
    // If disabling a day, clear its availability
    if (!enabled) {
      setAvailability(prev => ({
        ...prev,
        [day]: []
      }));
    }
  };

  const handleSaveAvailability = () => {
    // In a real app, this would make an API call
    console.log("Saving availability:", availability);
    toast.success("Availability settings saved successfully!");
    
    // Here you would typically call an API to update the provider's availability
  };

  const copyFromDay = (fromDay: string, toDay: string) => {
    if (availability[fromDay]) {
      setAvailability(prev => ({
        ...prev,
        [toDay]: [...prev[fromDay]]
      }));
      toast.success(`Copied availability from ${fromDay} to ${toDay}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Settings</CardTitle>
        <CardDescription>
          Set your working hours and availability for bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="mb-4 flex-wrap">
            {weekdays.map((day) => (
              <TabsTrigger key={day.id} value={day.id} disabled={!dayEnabled[day.id]}>
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weekdays.map((day) => (
            <TabsContent key={day.id} value={day.id} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={dayEnabled[day.id]} 
                    onCheckedChange={(checked) => handleToggleDay(day.id, checked)}
                    id={`${day.id}-toggle`}
                  />
                  <Label htmlFor={`${day.id}-toggle`}>{day.label} Availability</Label>
                </div>
                
                <div className="flex gap-2">
                  {dayEnabled[day.id] && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const prevDay = weekdays[(weekdays.findIndex(d => d.id === day.id) - 1 + 7) % 7].id;
                          copyFromDay(prevDay, day.id);
                        }}
                      >
                        Copy from Previous Day
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {dayEnabled[day.id] ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = availability[day.id]?.includes(time);
                    return (
                      <Button
                        key={time}
                        variant={isSelected ? "secondary" : "outline"}
                        className={`
                          h-20 flex flex-col items-center justify-center gap-1
                          ${isSelected ? "border-highlight-purple bg-highlight-purple/10" : ""}
                        `}
                        onClick={() => handleToggleTimeSlot(day.id, time)}
                      >
                        <Clock className={`h-4 w-4 ${isSelected ? "text-highlight-purple" : ""}`} />
                        <span>{time}</span>
                        {isSelected && <Check className="h-3 w-3 text-highlight-purple" />}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  <p>This day is set as unavailable</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleToggleDay(day.id, true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Enable {day.label}
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="mr-2">Cancel</Button>
          <Button onClick={handleSaveAvailability}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityManager;
