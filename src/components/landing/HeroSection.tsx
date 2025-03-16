
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="flex-grow flex items-center py-12 md:py-24 relative overflow-hidden">
      {/* Background decorative elements with colors */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-highlight-purple/10 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-highlight-blue/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <Badge className="px-4 py-1 mb-4 bg-gradient-to-r from-highlight-purple/20 to-highlight-blue/20 text-highlight-purple border-highlight-purple/20">
              Scheduling Reimagined
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Scheduling
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue ml-2">
                without boundaries
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 md:pr-12">
              Skidulo eliminates the back-and-forth emails. Share your availability and let others book time with you effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90">
                <Link to="/signup">Get started for free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full border-highlight-purple/20 text-highlight-purple backdrop-blur-sm">
                <a href="#how-it-works" className="flex items-center gap-2">
                  See how it works <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Calendar Preview with Glassmorphism and Color Highlights */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-highlight-purple/10 to-highlight-blue/10 rounded-2xl transform rotate-3 blur-sm"></div>
            <Card className="relative backdrop-blur-md bg-card/80 border-highlight-purple/10 rounded-2xl overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  {/* Calendar Header */}
                  <div className="bg-gradient-to-r from-highlight-purple/10 to-highlight-blue/10 p-6 border-b border-border/40">
                    <h3 className="font-medium mb-1">Book a meeting with Alex</h3>
                    <p className="text-sm text-muted-foreground">30 min | Zoom Meeting</p>
                  </div>
                  
                  {/* Calendar Body */}
                  <div className="p-6">
                    <div className="flex space-x-2 mb-6">
                      {["April 2024"].map((month, i) => (
                        <div key={i} className="text-center flex-1">
                          <div className="font-medium mb-3">{month}</div>
                          <div className="grid grid-cols-7 gap-1">
                            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                              <div key={i} className="text-xs text-muted-foreground p-1">{day}</div>
                            ))}
                            {Array.from({ length: 2 }, (_, i) => (
                              <div key={i} className="text-xs p-1 text-muted-foreground/50"></div>
                            ))}
                            {Array.from({ length: 30 }, (_, i) => {
                              const isAvailable = [2, 5, 8, 10, 15, 18, 22, 25].includes(i + 1);
                              const isSelected = i + 1 === 15;
                              return (
                                <div 
                                  key={i} 
                                  className={`text-xs p-1 rounded-full flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-highlight-purple text-white' 
                                      : isAvailable 
                                        ? 'hover:bg-highlight-purple/20 cursor-pointer' 
                                        : 'text-muted-foreground/50'
                                  }`}
                                >
                                  {i + 1}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-sm font-medium mb-3">Available times on April 15</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {["9:00am", "10:30am", "1:00pm", "2:30pm", "4:00pm", "5:30pm"].map((time, i) => (
                        <div 
                          key={i} 
                          className={`p-2 text-center text-sm rounded-lg border border-border/60 hover:border-highlight-purple hover:bg-highlight-purple/5 cursor-pointer transition-colors ${
                            i === 2 ? 'bg-highlight-purple/10 border-highlight-purple/30 text-highlight-purple' : ''
                          }`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
