
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DashboardStatsProps {
  username: string | undefined;
}

const DashboardStats = ({ username }: DashboardStatsProps) => {
  const { t } = useTranslation();
  
  // Mock data - in a real app, this would come from the API
  const stats = {
    totalBookings: 24,
    upcomingBookings: 8,
    completionRate: 96,
    averageRating: 4.8
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.totalBookings")}</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +12% {t("dashboard.fromLastMonth")}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.upcomingSessions")}</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.nextSession")}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.completionRate")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            +2% {t("dashboard.fromLastMonth")}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.averageRating")}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating}/5</div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.fromReviews")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
