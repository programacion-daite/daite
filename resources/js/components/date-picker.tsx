import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label: string;
  onSelect: (date: Date) => void;
  closeOnSelect?: boolean;
  value?: Date;
}

export function DatePicker({
  label,
  onSelect,
  closeOnSelect = true,
  value,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onSelect) onSelect(selectedDate);
  };

  return (
    <div className="input-label flex flex-col space-y-2">
      <Label>{label}</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            variant={'datePicker'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'dd/MM/yyyy') : <span>Seleccione una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => {
              handleSelect(day);
              if (closeOnSelect) setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
