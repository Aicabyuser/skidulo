import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SecuritySettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      // TODO: Implement password change logic
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
      console.error(error);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      setTwoFactorEnabled(enabled);
      // TODO: Implement 2FA toggle logic
      toast.success(enabled ? '2FA enabled successfully!' : '2FA disabled successfully!');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
      console.error(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      // TODO: Implement verification code check
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and authentication settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Password Change Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit">
              Update Password
            </Button>
          </form>
        </div>

        {/* 2FA Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm">
                Two-factor authentication is enabled. You'll be asked to enter a verification code when signing in from a new device.
              </p>
            </div>
          )}
        </div>

        {/* Session Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm mb-4">
              You're currently signed in on this device. You can sign out of all other devices if you suspect unauthorized access.
            </p>
            <Button variant="destructive">
              Sign Out All Other Devices
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Connect your account with these services for faster sign-in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Icons.google className="h-6 w-6" />
                <div>
                  <h4 className="text-sm font-semibold">Google</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign in with your Google account
                  </p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Icons.microsoft className="h-6 w-6" />
                <div>
                  <h4 className="text-sm font-semibold">Microsoft</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign in with your Microsoft account
                  </p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
} 