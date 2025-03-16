import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";

export default function IntegrationSettings() {
  const { toast } = useToast();

  const handleConnect = async (service: string) => {
    try {
      // TODO: Implement service connection logic
      toast({
        title: "Connection Initiated",
        description: `Connecting to ${service}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect to ${service}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Services</CardTitle>
          <CardDescription>
            Connect your calendar to automatically sync your availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.calendar className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  Sync your Google Calendar events
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("Google Calendar")}>
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.calendar className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Microsoft Outlook</h4>
                <p className="text-sm text-muted-foreground">
                  Sync your Outlook calendar events
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("Microsoft Outlook")}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Conferencing</CardTitle>
          <CardDescription>
            Connect your video conferencing services for automatic meeting creation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.video className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Google Meet</h4>
                <p className="text-sm text-muted-foreground">
                  Create Google Meet links automatically
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("Google Meet")}>
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.video className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Zoom</h4>
                <p className="text-sm text-muted-foreground">
                  Create Zoom meetings automatically
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("Zoom")}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Services</CardTitle>
          <CardDescription>
            Connect your payment processing services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.creditCard className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">Stripe</h4>
                <p className="text-sm text-muted-foreground">
                  Process payments with Stripe
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("Stripe")}>
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icons.creditCard className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-semibold">PayPal</h4>
                <p className="text-sm text-muted-foreground">
                  Process payments with PayPal
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect("PayPal")}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 