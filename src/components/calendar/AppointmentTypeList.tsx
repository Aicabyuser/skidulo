import { useState } from 'react';
import { AppointmentType } from '@/lib/types/calendar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Clock, DollarSign, Video, MapPin } from 'lucide-react';
import AppointmentTypeDialog from './AppointmentTypeDialog';

interface AppointmentTypeListProps {
  appointmentTypes: AppointmentType[];
  onUpdate: (id: string, updates: Partial<AppointmentType>) => void;
}

export default function AppointmentTypeList({
  appointmentTypes,
  onUpdate,
}: AppointmentTypeListProps) {
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);

  const handleStatusToggle = (id: string, isActive: boolean) => {
    onUpdate(id, { isActive });
  };

  const handleEditSubmit = (data: Omit<AppointmentType, 'id'>) => {
    if (editingType) {
      onUpdate(editingType.id, data);
      setEditingType(null);
    }
  };

  return (
    <div className="space-y-4">
      {appointmentTypes.map((type) => (
        <Card key={type.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <h3 className="text-lg font-semibold">{type.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={type.isActive}
                onCheckedChange={(checked) => handleStatusToggle(type.id, checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingType(type)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {type.duration} minutes
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ${type.price}
            </div>
            <div className="flex items-center gap-2">
              {type.locationOptions.includes('online') && (
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Online
                </div>
              )}
              {type.locationOptions.includes('in-person') && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  In-person
                </div>
              )}
            </div>
            {type.requiresConfirmation && (
              <div className="text-sm text-yellow-600">
                Requires confirmation
              </div>
            )}
          </div>
        </Card>
      ))}

      <AppointmentTypeDialog
        open={!!editingType}
        onOpenChange={(open) => !open && setEditingType(null)}
        onSubmit={handleEditSubmit}
        defaultValues={editingType || undefined}
      />
    </div>
  );
} 