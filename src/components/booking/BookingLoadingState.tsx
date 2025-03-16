
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const BookingLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-secondary rounded-full mb-4"></div>
          <div className="h-6 w-3/4 bg-secondary rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-secondary rounded"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading provider information...</p>
      </Card>
    </div>
  );
};

export default BookingLoadingState;
