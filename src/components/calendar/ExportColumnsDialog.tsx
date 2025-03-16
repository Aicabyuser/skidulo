import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import { ExportColumn } from '@/lib/utils/export';

interface ExportColumnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumns: ExportColumn[];
  onExport: (columns: ExportColumn[], format: 'csv' | 'excel' | 'pdf') => void;
}

export default function ExportColumnsDialog({
  open,
  onOpenChange,
  defaultColumns,
  onExport,
}: ExportColumnsDialogProps) {
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn[]>(
    defaultColumns
  );
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedColumns(items);
  };

  const toggleColumn = (column: ExportColumn) => {
    const isSelected = selectedColumns.some(
      (col) => col.key === column.key
    );

    if (isSelected) {
      setSelectedColumns(
        selectedColumns.filter((col) => col.key !== column.key)
      );
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleExport = () => {
    onExport(selectedColumns, format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Export Columns</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Export Format
            </label>
            <div className="flex gap-2">
              <Button
                variant={format === 'csv' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('csv')}
              >
                CSV
              </Button>
              <Button
                variant={format === 'excel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('excel')}
              >
                Excel
              </Button>
              <Button
                variant={format === 'pdf' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('pdf')}
              >
                PDF
              </Button>
            </div>
          </div>

          <label className="text-sm font-medium mb-2 block">
            Select and Reorder Columns
          </label>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {defaultColumns.map((column, index) => (
                    <Draggable
                      key={column.key}
                      draggableId={column.key}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Checkbox
                            checked={selectedColumns.some(
                              (col) => col.key === column.key
                            )}
                            onCheckedChange={() => toggleColumn(column)}
                          />
                          <span className="text-sm">{column.label}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 