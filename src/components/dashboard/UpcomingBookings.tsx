
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Video, MapPin, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface UpcomingBookingsProps {
  username: string | undefined;
  limit?: number;
}

const UpcomingBookings = ({ username, limit }: UpcomingBookingsProps) => {
  // Mock data - in a real app, this would come from the API
  const bookings = [
    {
      id: "booking-1",
      clientName: "John Smith",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      time: "10:00",
      meetingType: "video" as const,
      status: "confirmed",
    },
    {
      id: "booking-2",
      clientName: "Maria Rodriguez",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // day after tomorrow
      time: "14:00",
      meetingType: "in-person" as const,
      status: "confirmed",
    },
    {
      id: "booking-3",
      clientName: "Alex Johnson",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "11:00",
      meetingType: "video" as const,
      status: "confirmed",
    },
    {
      id: "booking-4",
      clientName: "Sarah Williams",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: "15:30",
      meetingType: "in-person" as const,
      status: "confirmed",
    },
    {
      id: "booking-5",
      clientName: "David Brown",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: "09:00",
      meetingType: "video" as const,
      status: "confirmed",
    },
    {
      id: "booking-6",
      clientName: "Emily Davis",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      time: "13:00",
      meetingType: "in-person" as const,
      status: "confirmed",
    },
  ];

  // Apply limit if specified
  const displayedBookings = limit ? bookings.slice(0, limit) : bookings;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.clientName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(booking.date, "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {booking.time}
                  </div>
                </TableCell>
                <TableCell>
                  {booking.meetingType === "video" ? (
                    <div className="flex items-center gap-1 text-blue-500">
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-500">
                      <MapPin className="h-4 w-4" />
                      <span>In-person</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Cancel</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {displayedBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No upcoming bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {limit && bookings.length > limit && (
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Bookings</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
