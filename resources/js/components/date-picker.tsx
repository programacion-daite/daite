"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import * as React from "react"

export default function DatePicker({ label, id, required }: { label: string, id: string, required?: boolean }) {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal hover:text-white",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
            id={id}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
