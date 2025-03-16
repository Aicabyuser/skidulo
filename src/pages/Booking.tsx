
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProviderProfile, fetchAvailableTimeSlots } from "@/lib/api";
import ProviderInfoCard from "@/components/booking/ProviderInfoCard";
import DateTimeSelector from "@/components/booking/DateTimeSelector";
import BookingFormWrapper from "@/components/booking/BookingFormWrapper";
import BookingLoadingState from "@/components/booking/BookingLoadingState";
import BookingErrorState from "@/components/booking/BookingErrorState";
import BookingAssistant from "@/components/booking/BookingAssistant";

const Booking = () => {
  const { username } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<"video" | "in-person">("video");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log("Booking component rendering with username:", username);
  }, [username]);

  const { data: provider, isLoading: isLoadingProvider, error: providerError } = useQuery({
    queryKey: ["provider", username],
    queryFn: () => {
      console.log("Fetching provider data for:", username);
      return fetchProviderProfile(username as string);
    },
    enabled: !!username,
    retry: 1,
  });

  const { data: timeSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["timeSlots", username, selectedDate],
    queryFn: () => fetchAvailableTimeSlots(username as string, selectedDate as Date),
    enabled: !!selectedDate && !!username && !!provider,
  });

  useEffect(() => {
    if (providerError) {
      console.error("Error loading provider data:", providerError);
      toast.error("Failed to load provider information");
    }
  }, [providerError]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(false);
  };

  const handleContinue = () => {
    if (selectedTime) {
      setShowForm(true);
    } else {
      toast.error("Please select a time slot");
    }
  };

  if (isLoadingProvider) {
    return <BookingLoadingState />;
  }

  if (providerError || !provider) {
    return <BookingErrorState username={username} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProviderInfoCard 
              provider={provider} 
              meetingType={meetingType}
              setMeetingType={setMeetingType}
            />

            {!showForm && selectedDate && timeSlots && timeSlots.length > 0 && (
              <div className="mt-6">
                <BookingAssistant 
                  username={username}
                  selectedDate={selectedDate}
                  onSelectTime={handleTimeSelect}
                  availableSlots={timeSlots}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <DateTimeSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              handleTimeSelect={handleTimeSelect}
              timeSlots={timeSlots}
              isLoadingSlots={isLoadingSlots}
              handleContinue={handleContinue}
              showForm={showForm}
            />

            {showForm && selectedDate && selectedTime && (
              <BookingFormWrapper
                provider={provider}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                meetingType={meetingType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
