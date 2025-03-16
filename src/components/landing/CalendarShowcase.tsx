
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const CalendarShowcase = () => {
  const templates = [
    {
      title: "One-on-One Meetings",
      description: "Perfect for interviews, consultations, and mentoring sessions",
      slots: ["30 min", "45 min", "60 min"],
      times: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
      gradientFrom: "from-highlight-purple",
      gradientTo: "to-highlight-blue"
    },
    {
      title: "Group Sessions",
      description: "Ideal for workshops, webinars, and team meetings",
      slots: ["60 min", "90 min", "120 min"],
      times: ["10:00 AM", "1:00 PM", "4:00 PM"],
      gradientFrom: "from-highlight-blue",
      gradientTo: "to-highlight-teal"
    },
    {
      title: "Recurring Appointments",
      description: "Great for regular check-ins, coaching, and therapy sessions",
      slots: ["Weekly", "Bi-weekly", "Monthly"],
      times: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      gradientFrom: "from-highlight-pink",
      gradientTo: "to-highlight-orange"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background/0 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-highlight-teal/5 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-blue to-highlight-teal">
            Flexible Scheduling Options
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create the perfect scheduling experience for any scenario
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {templates.map((template, i) => (
              <CarouselItem key={i} className="md:basis-1/1">
                <Card className="backdrop-blur-md bg-card/60 border-highlight-purple/10 overflow-hidden shadow-xl">
                  <CardContent className="p-0">
                    <div className="flex flex-col h-full">
                      <div className={`bg-gradient-to-r ${template.gradientFrom}/20 ${template.gradientTo}/10 p-6 border-b border-border/40`}>
                        <h3 className="text-xl font-medium mb-1">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                          {template.slots.map((slot, j) => (
                            <div
                              key={j}
                              className={`px-4 py-2 rounded-full border ${
                                j === 0 
                                  ? `bg-${template.gradientFrom.replace('from-', '')}/10 border-${template.gradientFrom.replace('from-', '')}/30 text-${template.gradientFrom.replace('from-', '')}` 
                                  : 'border-border hover:border-highlight-purple/30 hover:bg-highlight-purple/5'
                              } cursor-pointer transition-colors whitespace-nowrap`}
                            >
                              {slot}
                            </div>
                          ))}
                        </div>

                        <h4 className="text-sm font-medium mb-3">Available times</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {template.times.map((time, j) => (
                            <div
                              key={j}
                              className={`p-3 text-center text-sm rounded-lg border border-border/60 hover:border-${template.gradientFrom.replace('from-', '')} hover:bg-${template.gradientFrom.replace('from-', '')}/5 cursor-pointer transition-colors`}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="static transform-none mr-2 bg-white/80 border-highlight-purple/20 text-highlight-purple hover:bg-highlight-purple/10" />
            <CarouselNext className="static transform-none bg-white/80 border-highlight-blue/20 text-highlight-blue hover:bg-highlight-blue/10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default CalendarShowcase;
