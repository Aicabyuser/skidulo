
import React from "react";
import { Calendar, Clock, User, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

interface DashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  const navItems = [
    {
      id: "overview",
      label: t("dashboard.overview"),
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      id: "bookings",
      label: t("dashboard.bookings"),
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "availability",
      label: t("dashboard.availability"),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "profile",
      label: t("dashboard.profile"),
      icon: <User className="h-4 w-4" />,
    },
  ];

  if (isMobile) {
    return (
      <div className="mb-6 overflow-x-auto">
        <ScrollArea className="w-full">
          <div className="flex space-x-2 p-1 min-w-max">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                size="sm"
                className={`flex-shrink-0 ${
                  activeTab === item.id 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardNav;
