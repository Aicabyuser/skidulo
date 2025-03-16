import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ReminderSettingsProps {
  hostId: string;
}

export default function ReminderSettings({ hostId }: ReminderSettingsProps) {
  const [settings, setSettings] = useState({
    initialReminder: 24,
    followUpReminder: 2,
    hostReminder: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [hostId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('hostId', hostId)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          initialReminder: data.initialReminder,
          followUpReminder: data.followUpReminder,
          hostReminder: data.hostReminder,
        });
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
      toast.error('Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('reminder_settings')
        .upsert({
          hostId,
          ...settings,
        });

      if (error) throw error;

      toast.success('Reminder settings saved successfully');
    } catch (error) {
      console.error('Error saving reminder settings:', error);
      toast.error('Failed to save reminder settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading reminder settings...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Reminder Settings</h2>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="initialReminder">Initial Reminder (hours before)</Label>
          <Input
            id="initialReminder"
            type="number"
            min="1"
            max="72"
            value={settings.initialReminder}
            onChange={(e) =>
              setSettings({
                ...settings,
                initialReminder: parseInt(e.target.value),
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            Send first reminder this many hours before the appointment
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="followUpReminder">Follow-up Reminder (hours before)</Label>
          <Input
            id="followUpReminder"
            type="number"
            min="1"
            max="24"
            value={settings.followUpReminder}
            onChange={(e) =>
              setSettings({
                ...settings,
                followUpReminder: parseInt(e.target.value),
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            Send a follow-up reminder this many hours before the appointment
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hostReminder">Host Reminder (hours before)</Label>
          <Input
            id="hostReminder"
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            value={settings.hostReminder}
            onChange={(e) =>
              setSettings({
                ...settings,
                hostReminder: parseFloat(e.target.value),
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            Send you (the host) a reminder this many hours before the appointment
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </Card>
  );
} 