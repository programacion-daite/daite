import { DatePicker as OriginalDatePicker } from '@/components/date-picker';

interface CustomDatePickerProps extends Omit<React.ComponentProps<typeof OriginalDatePicker>, 'onSelect'> {
    name: string;
    id: string;
    selected?: Date | string;
    onSelect: (date: Date, name: string) => void;
}

export function CustomDatePicker({ id, name, onSelect, selected, ...props }: CustomDatePickerProps) {
  return (
    <OriginalDatePicker
      {...props}
      name={name}
      id={id}
      selected={selected}
      onSelect={(date) => {
        if (date) {
          onSelect(date, name);
        }
      }}
    />
  );
}
