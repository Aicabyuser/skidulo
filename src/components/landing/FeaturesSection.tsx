
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, Clock, Users, Zap, CheckCircle } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 p-2" />,
      title: "Smart Scheduling",
      description: "Share your link and let others choose a time that works for both of you",
      color: "bg-highlight-purple"
    },
    {
      icon: <Globe className="h-10 w-10 p-2" />,
      title: "Calendar Integration",
      description: "Connects with your Google, Outlook, or Apple calendar to prevent double bookings",
      color: "bg-highlight-blue"
    },
    {
      icon: <Clock className="h-10 w-10 p-2" />,
      title: "Automated Reminders",
      description: "Send automatic reminders to reduce no-shows and keep everyone on track",
      color: "bg-highlight-teal"
    },
    {
      icon: <Users className="h-10 w-10 p-2" />,
      title: "Team Scheduling",
      description: "Coordinate availability across your entire team for efficient group meetings",
      color: "bg-highlight-pink"
    },
    {
      icon: <Zap className="h-10 w-10 p-2" />,
      title: "Custom Workflows",
      description: "Build automated workflows to streamline your meeting process end-to-end",
      color: "bg-highlight-orange"
    },
    {
      icon: <CheckCircle className="h-10 w-10 p-2" />,
      title: "Booking Forms",
      description: "Collect information before meetings with customizable intake forms",
      color: "bg-highlight-purple"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 relative">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-highlight-purple/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
            Why choose Skidulo?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your scheduling process and save valuable time
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]">
              <CardContent className="p-6">
                <div className={`${feature.color}/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 text-${feature.color.replace('bg-', '')}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
