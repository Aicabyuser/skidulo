import { Button } from '@/components/ui/button';
import { Appointment } from '@/lib/types/calendar';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BatchActionsBarProps {
  selectedAppointments: Appointment[];
  onBatchStatusUpdate: (status: Appointment['status']) => Promise<void>;
  onExport: () => void;
  onClearSelection: () => void;
}

export default function BatchActionsBar({
  selectedAppointments,
  onBatchStatusUpdate,
  onExport,
  onClearSelection,
}: BatchActionsBarProps) {
  if (selectedAppointments.length === 0) return null;

  const hasPendingAppointments = selectedAppointments.some(
    (appointment) => appointment.status === 'pending'
  );
  const hasConfirmedAppointments = selectedAppointments.some(
    (appointment) => appointment.status === 'confirmed'
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {selectedAppointments.length} appointment{selectedAppointments.length > 1 ? 's' : ''} selected
          </span>
          <Button variant="link" onClick={onClearSelection}>
            Clear selection
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {hasPendingAppointments && (
            <Button
              variant="default"
              onClick={() => onBatchStatusUpdate('confirmed')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Confirm Selected
            </Button>
          )}
          {(hasPendingAppointments || hasConfirmedAppointments) && (
            <Button
              variant="destructive"
              onClick={() => onBatchStatusUpdate('cancelled')}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel Selected
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected
          </Button>
        </div>
      </div>
    </div>
  );
} 