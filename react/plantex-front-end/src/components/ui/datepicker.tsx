import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Controller, useFormContext } from "react-hook-form";

interface DatePickerProps {
  defaultPlaceHolder?: string;
  date: Date | undefined;
  name: string;
  error: string | undefined;
  className?: string;
}

export function DatePicker({
  defaultPlaceHolder,
  date,
  name,
  error,
  className = "",
}: DatePickerProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal ",
              !date && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", {
                locale: ptBR,
              })
            ) : (
              <span>{defaultPlaceHolder || "Pick a Date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => {
                  onChange(date);
                }}
                initialFocus
                locale={ptBR}
              />
            )}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <div className="min-h-[20px] mt-1">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
