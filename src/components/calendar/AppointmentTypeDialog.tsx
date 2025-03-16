import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AppointmentType } from '@/lib/types/calendar';

interface AppointmentTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<AppointmentType, 'id'>) => void;
  defaultValues?: Partial<AppointmentType>;
}

export default function AppointmentTypeDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: AppointmentTypeDialogProps) {
  const [formData, setFormData] = useState<Partial<AppointmentType>>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    color: '#000000',
    isActive: true,
    requiresConfirmation: false,
    locationOptions: ['online'],
    ...defaultValues,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<AppointmentType, 'id'>);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Edit Appointment Type' : 'Create Appointment Type'}
          </DialogTitle>
          <DialogDescription>
            Set up a new type of appointment that clients can book.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Initial Consultation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the appointment"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                step={15}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">
                Allow clients to book this type of appointment
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Requires Confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Manually approve each booking request
              </p>
            </div>
            <Switch
              checked={formData.requiresConfirmation}
              onCheckedChange={(checked) => setFormData({ ...formData, requiresConfirmation: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Location Options</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.locationOptions?.includes('online')}
                  onChange={(e) => {
                    const options = new Set(formData.locationOptions);
                    if (e.target.checked) {
                      options.add('online');
                    } else {
                      options.delete('online');
                    }
                    setFormData({ ...formData, locationOptions: Array.from(options) });
                  }}
                />
                Online
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.locationOptions?.includes('in-person')}
                  onChange={(e) => {
                    const options = new Set(formData.locationOptions);
                    if (e.target.checked) {
                      options.add('in-person');
                    } else {
                      options.delete('in-person');
                    }
                    setFormData({ ...formData, locationOptions: Array.from(options) });
                  }}
                />
                In-person
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {defaultValues ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 