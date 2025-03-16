
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface ProfileSettingsProps {
  provider: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    serviceName: string;
    serviceDescription: string;
    duration: number;
    price: number;
  };
}

const ProfileSettings = ({ provider }: ProfileSettingsProps) => {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the profile
    toast.success("Profile settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal and professional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24 border-2 border-highlight-purple/20">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback className="bg-highlight-purple/20 text-highlight-purple text-xl">
                    {provider.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" /> Change Photo
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={provider.name} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue={provider.title} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue={provider.bio} 
                    className="min-h-[120px]" 
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit">Save Profile Information</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Settings</CardTitle>
          <CardDescription>
            Configure the services you offer to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <Input id="serviceName" defaultValue={provider.serviceName} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Service Description</Label>
              <Textarea 
                id="serviceDescription" 
                defaultValue={provider.serviceDescription} 
                className="min-h-[80px]" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  defaultValue={provider.duration} 
                  min={15} 
                  step={15} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  defaultValue={provider.price} 
                  min={0} 
                  step={1} 
                />
                <p className="text-xs text-muted-foreground">Set to 0 for free sessions</p>
              </div>
            </div>
            
            <Button type="submit">Save Service Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
