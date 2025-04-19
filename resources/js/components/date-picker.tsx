import { format, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { es } from 'date-fns/locale';
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
  // Definimos primero las constantes
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

  // Nos aseguramos de que value es una fecha válida
  const safeValue = React.useMemo(() => {
    const now = new Date();
    return value instanceof Date && !isNaN(value.getTime()) ? value : now;
  }, [value]);

  // Estado para la fecha seleccionada
  const [date, setDate] = React.useState<Date>(safeValue);

  // Estado separado para controlar qué mes se muestra en el calendario
  const [currentMonth, setCurrentMonth] = React.useState<Date>(safeValue);

  // Estado para los selectores - usamos valores seguros
  const [selectedMonth, setSelectedMonth] = React.useState<string>(months[getMonth(safeValue)]);
  const [selectedYear, setSelectedYear] = React.useState<string>(getYear(safeValue).toString());

  const [open, setOpen] = React.useState(false);

  // Solo actualizamos cuando value cambia, no en cada renderizado
  React.useEffect(() => {
    const validValue = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

    // Comparamos antes de actualizar para evitar bucles infinitos
    if (date.getTime() !== validValue.getTime()) {
      setDate(validValue);
      setCurrentMonth(validValue);

      // No actualizamos selectedMonth y selectedYear aquí para evitar bucles
      // Lo haremos en un useEffect separado
    }
  }, [value]);

  // Efecto separado para actualizar los selectores solo cuando currentMonth cambia
  React.useEffect(() => {
    const monthValue = months[getMonth(currentMonth)];
    const yearValue = getYear(currentMonth).toString();

    // Comparamos antes de actualizar
    if (selectedMonth !== monthValue) {
      setSelectedMonth(monthValue);
    }

    if (selectedYear !== yearValue) {
      setSelectedYear(yearValue);
    }
  }, [currentMonth, months, selectedMonth, selectedYear]);

  const handleMonthChange = (month: string) => {
    if (month === selectedMonth) return; // Evitar actualizaciones innecesarias

    setSelectedMonth(month);
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return;

    const newDate = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    if (year === selectedYear) return; // Evitar actualizaciones innecesarias

    setSelectedYear(year);
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;

    const newDate = setYear(currentMonth, yearNum);
    setCurrentMonth(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return;

    // Actualizamos la fecha seleccionada
    setDate(selectedDate);

    // También actualizamos el mes visible para que coincida
    setCurrentMonth(selectedDate);

    // Actualizamos directamente sin pasar por useEffect
    const monthValue = months[getMonth(selectedDate)];
    const yearValue = getYear(selectedDate).toString();
    setSelectedMonth(monthValue);
    setSelectedYear(yearValue);

    if (onSelect) onSelect(selectedDate);

    if (closeOnSelect) setOpen(false);
  };

  const handleMonthChangeFromCalendar = (month: Date) => {
    if (month && !isNaN(month.getTime())) {
      // Solo actualizamos currentMonth, los selectores se actualizarán por el useEffect
      setCurrentMonth(month);
    }
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
                {date ? format(date, 'dd/MM/yyyy', { locale: es }) : <span>Seleccione una fecha</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex justify-between p-2">
            <Select
              value={selectedMonth}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Mes">{selectedMonth}</SelectValue>
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
              value={selectedYear}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Año">{selectedYear}</SelectValue>
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
            locale={es}
            selected={date}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={handleMonthChangeFromCalendar}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
