
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { createBooking } from "@/lib/api";
import { scheduleBookingNotifications } from "@/lib/notifications";
import { formSchema, BookingFormValues } from "./BookingFormSchema";
import UserInfoFields from "./UserInfoFields";
import NotesField from "./NotesField";
import FormActions from "./FormActions";
import PaymentCheckout from "./PaymentCheckout";

interface BookingFormProps {
  providerName: string;
  serviceName: string;
  date: Date;
  time: string;
  meetingType: "video" | "in-person";
  price?: number;
}

const BookingForm = ({ 
  providerName, 
  serviceName, 
  date, 
  time, 
  meetingType,
  price = 0
}: BookingFormProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
      serviceName: serviceName,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: async (data, variables) => {
      // Send booking confirmation and schedule reminders
      try {
        await scheduleBookingNotifications({
          recipientEmail: variables.email,
          recipientName: variables.name,
          providerName: variables.providerName,
          serviceName: variables.serviceName,
          date: variables.date,
          time: variables.time,
          meetingType: variables.meetingType,
        });
        
        toast.success("Booking confirmed!", {
          description: "You will receive an email confirmation shortly.",
        });
        // Could redirect to a confirmation page here
      } catch (error) {
        console.error("Failed to send notifications:", error);
        toast.error("Booking confirmed, but we couldn't send confirmation emails", {
          description: "Your booking is still valid.",
        });
      }
    },
    onError: (error) => {
      toast.error("Booking failed", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    },
  });

  function onSubmit(values: BookingFormValues) {
    if (price > 0 && !showPayment) {
      setShowPayment(true);
      return;
    }

    bookingMutation.mutate({
      name: values.name,
      email: values.email,
      notes: values.notes,
      date,
      time,
      meetingType,
      providerName,
      serviceName,
    });
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      form.handleSubmit((values) => {
        bookingMutation.mutate({
          name: values.name,
          email: values.email,
          notes: values.notes,
          date,
          time,
          meetingType,
          providerName,
          serviceName,
          paid: true,
          amount: price,
        });
      })();
    }, 2000);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <UserInfoFields />
          <NotesField />
          <FormActions 
            isSubmitting={bookingMutation.isPending} 
            showPayment={showPayment && price > 0}
            price={price}
          />
        </form>
      </Form>
      
      {showPayment && (
        <PaymentCheckout 
          price={price} 
          serviceName={serviceName}
          isSubmitting={paymentProcessing}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </FormProvider>
  );
};

export default BookingForm;
