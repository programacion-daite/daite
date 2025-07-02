"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  label: string;
  id: string;
  required?: boolean;
  value?: Date;
  error?: string;
  onSelect?: (date: Date) => void;
}

export default function DatePicker({ id, label, onSelect, required, value, error }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = React.useCallback((newDate: Date | undefined) => {
    setDate(newDate)
    setOpen(false)
    if (newDate && onSelect) {
      onSelect(newDate)
    }
  }, [onSelect])

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          error && "text-red-500 font-medium",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal hover:text-white",
              !date && "text-muted-foreground",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            id={id}
            locale={es}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500 font-medium mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
