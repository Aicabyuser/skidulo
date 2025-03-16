
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/common/LanguageSelector";

interface DashboardHeaderProps {
  provider: {
    name: string;
    title: string;
    avatar: string;
    username: string;
  };
}

const DashboardHeader = ({ provider }: DashboardHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <header className="py-4 px-6 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-highlight-purple/20">
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback className="bg-highlight-purple/20 text-highlight-purple">
              {provider.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-medium">{provider.name}</h1>
            <p className="text-sm text-muted-foreground">{provider.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-highlight-purple"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link to={`/booking/${provider.username}`}>{t("dashboard.viewBookingPage")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
