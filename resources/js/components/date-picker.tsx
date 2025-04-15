import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export function DatePicker({ label, onSelect }: { label: string, onSelect: (date: Date) => void }) {
  const [date, setDate] = React.useState<Date>()

  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    if (date && onSelect) onSelect(date);
  };

  return (
    <div className="flex flex-col space-y-2">
        <Label>{label}</Label>
            <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"datePicker"}
            className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
            )}
            >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            />
        </PopoverContent>
        </Popover>
    </div>
  )
}