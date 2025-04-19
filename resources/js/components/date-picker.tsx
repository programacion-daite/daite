import { format, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface DatePickerProps {
  label: string;
  onSelect: (date: Date) => void;
  closeOnSelect?: boolean;
  value?: Date;
  startYear?: number,
  endYear?: number
}

export function DatePicker({
  label,
  onSelect,
  closeOnSelect = true,
  value = new Date(),
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date())
}: DatePickerProps) {
  // Estado para la fecha seleccionada
  const [date, setDate] = React.useState<Date | undefined>(value);

  // Estado separado para controlar qué mes se muestra en el calendario
  const [currentMonth, setCurrentMonth] = React.useState<Date>(value);

  const [open, setOpen] = React.useState(false);

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  React.useEffect(() => {
    setDate(value);
    setCurrentMonth(value); // También actualizamos el mes visible
  }, [value]);

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return;

    // Solo actualizamos el mes visible, no la fecha seleccionada
    const newDate = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;

    // Solo actualizamos el mes visible, no la fecha seleccionada
    const newDate = setYear(currentMonth, yearNum);
    setCurrentMonth(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // Actualizamos la fecha seleccionada
    setDate(selectedDate);

    // También actualizamos el mes visible para que coincida
    setCurrentMonth(selectedDate);

    if (onSelect) onSelect(selectedDate);

    if (closeOnSelect) setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
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
          <div className="flex justify-between p-2">
            <Select
              value={months[getMonth(currentMonth)]}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={getYear(currentMonth).toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={currentMonth} // Usamos el estado separado para el mes visible
            onMonthChange={setCurrentMonth} // Actualizamos solo el mes visible, no la fecha seleccionada
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
