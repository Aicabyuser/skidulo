
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Video, CreditCard } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface BookingFormWrapperProps {
  provider: {
    name: string;
    serviceName: string;
    price?: number;
  };
  selectedDate: Date;
  selectedTime: string;
  meetingType: "video" | "in-person";
}

const BookingFormWrapper = ({
  provider,
  selectedDate,
  selectedTime,
  meetingType
}: BookingFormWrapperProps) => {
  const isMobile = useIsMobile();

  const bookingInfo = (
    <div className="flex items-center mt-2 text-sm flex-wrap gap-y-2">
      <CalendarIcon className="mr-2 h-4 w-4 text-highlight-blue" />
      <span className="mr-3">{format(selectedDate, "EEE, MMM d, yyyy")}</span>
      <Clock className="mr-2 h-4 w-4 text-highlight-purple" />
      <span className="mr-3">{selectedTime}</span>
      {meetingType === "video" ? (
        <Video className="mr-2 h-4 w-4 text-highlight-teal" />
      ) : (
        <MapPin className="mr-2 h-4 w-4 text-highlight-orange" />
      )}
      <span className="mr-3">{meetingType === "video" ? "Video Call" : "In Person"}</span>
      {provider.price && provider.price > 0 && (
        <>
          <CreditCard className="mr-2 h-4 w-4 text-highlight-green" />
          <span>${provider.price}</span>
        </>
      )}
    </div>
  );

  const bookingForm = (
    <BookingForm 
      providerName={provider.name}
      serviceName={provider.serviceName}
      date={selectedDate}
      time={selectedTime}
      meetingType={meetingType}
      price={provider.price || 0}
    />
  );

  if (isMobile) {
    return (
      <div className="mt-6">
        <Card className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Complete Your Booking</CardTitle>
            <CardDescription>{bookingInfo}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">{bookingForm}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-foreground">Complete Your Booking</CardTitle>
        <CardDescription>{bookingInfo}</CardDescription>
      </CardHeader>
      <CardContent>{bookingForm}</CardContent>
    </Card>
  );
};

export default BookingFormWrapper;
