import { Controller, useFormContext } from "react-hook-form";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  name: string;
  error?: string;
  defaultPlaceHolder?: string;
  time?: string;
  className?: string;
}

export function TimePicker({
  name,
  error,
  defaultPlaceHolder = "Selecione o horário",
  time,
  className = "",
}: TimePickerProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !time && "text-muted-foreground",
              time && "text-primary",
              error && "border-red-500"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {time ? time : <span>{defaultPlaceHolder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                type="time"
                value={field.value || ""}
                onChange={field.onChange}
                className={cn(
                  "rounded-2xl border border-input px-4 py-2 text-sm shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                  "text-primary",
                  error && "border-red-500"
                )}
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
