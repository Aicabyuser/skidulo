
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const NotificationPreferences = () => {
  const form = useFormContext();
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-highlight-purple" />
        <h3 className="font-medium">{t("booking.notificationPreferences")}</h3>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="emailConfirmation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t("booking.emailConfirmation")}</FormLabel>
                <FormDescription>
                  {t("booking.emailConfirmationDesc")}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                  disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailReminders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t("booking.appointmentReminders")}</FormLabel>
                <FormDescription>
                  {t("booking.appointmentRemindersDesc")}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default NotificationPreferences;
