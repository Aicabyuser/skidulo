
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProviderProfile } from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import AvailabilityManager from "@/components/dashboard/AvailabilityManager";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationManager from "@/components/dashboard/NotificationManager";

const ProviderDashboard = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", username],
    queryFn: () => fetchProviderProfile(username as string),
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find a provider with the username "{username}".
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader provider={provider} />
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                <DashboardStats username={username} />
                <UpcomingBookings username={username} limit={3} />
                <NotificationManager username={username} />
              </>
            )}
            
            {activeTab === "bookings" && (
              <UpcomingBookings username={username} />
            )}
            
            {activeTab === "availability" && (
              <AvailabilityManager provider={provider} />
            )}
            
            {activeTab === "profile" && (
              <ProfileSettings provider={provider} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
