
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Settings, Clock, Calendar, RefreshCw } from "lucide-react";

interface NotificationManagerProps {
  username: string | undefined;
}

const NotificationManager = ({ username }: NotificationManagerProps) => {
  // These would come from API in a real app
  const [emailSettings, setEmailSettings] = React.useState({
    bookingConfirmations: true,
    bookingReminders: true,
    bookingCancellations: true,
    dailySummary: false,
  });
  
  const handleSaveSettings = () => {
    console.log("Saving notification settings:", emailSettings);
    // In a real app, this would save to the database
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="mb-4">
            <TabsTrigger value="email">Email Notifications</TabsTrigger>
            <TabsTrigger value="templates" disabled>Notification Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="booking-confirmations">Booking Confirmations</Label>
                  </div>
                  <Switch
                    id="booking-confirmations"
                    checked={emailSettings.bookingConfirmations}
                    onCheckedChange={(checked) => 
                      setEmailSettings(prev => ({ ...prev, bookingConfirmations: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="booking-reminders">Booking Reminders</Label>
                  </div>
                  <Switch
                    id="booking-reminders"
                    checked={emailSettings.bookingReminders}
                    onCheckedChange={(checked) => 
                      setEmailSettings(prev => ({ ...prev, bookingReminders: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="booking-cancellations">Cancellation Notifications</Label>
                  </div>
                  <Switch
                    id="booking-cancellations"
                    checked={emailSettings.bookingCancellations}
                    onCheckedChange={(checked) => 
                      setEmailSettings(prev => ({ ...prev, bookingCancellations: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="daily-summary">Daily Summary</Label>
                  </div>
                  <Switch
                    id="daily-summary"
                    checked={emailSettings.dailySummary}
                    onCheckedChange={(checked) => 
                      setEmailSettings(prev => ({ ...prev, dailySummary: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                className="bg-highlight-purple hover:bg-highlight-purple/90"
              >
                Save Notification Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationManager;
