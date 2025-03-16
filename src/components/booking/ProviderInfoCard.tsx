
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Video, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProviderInfoCardProps {
  provider: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    serviceName: string;
    serviceDescription: string;
    duration: number;
    username: string;
  };
  meetingType: "video" | "in-person";
  setMeetingType: (type: "video" | "in-person") => void;
}

const ProviderInfoCard = ({ provider, meetingType, setMeetingType }: ProviderInfoCardProps) => {
  return (
    <Card className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center mb-3">
          <Avatar className="h-12 w-12 mr-4 border-2 border-highlight-purple/20">
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback className="bg-highlight-purple/20 text-highlight-purple">
              {provider.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl text-foreground">{provider.name}</CardTitle>
            <CardDescription>{provider.title}</CardDescription>
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{provider.bio}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-base font-medium mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
            {provider.serviceName}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">({provider.duration} min)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{provider.serviceDescription}</p>
        <Tabs defaultValue={meetingType} onValueChange={(value) => setMeetingType(value as "video" | "in-person")}>
          <TabsList className="w-full">
            <TabsTrigger value="video" className="w-full">
              <Video className="mr-2 h-4 w-4" />
              Video Call
            </TabsTrigger>
            <TabsTrigger value="in-person" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              In Person
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0 opacity-70 hover:opacity-100 transition-opacity">
        <Button variant="link" size="sm" className="text-xs w-full" asChild>
          <Link to={`/dashboard/${provider.username}`}>
            <Sparkles className="h-3 w-3 mr-1" />
            Provider Dashboard (Demo)
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProviderInfoCard;
