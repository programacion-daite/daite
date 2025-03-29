import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputLabelProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  autoComplete?: string;
  disabled?: boolean;
  ref?: React.RefCallback<HTMLElement>;
}

export function InputLabel({
  id,
  type = "text",
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  tabIndex = 1,
  autoComplete = id,
  disabled = false,
  ref = undefined
}: InputLabelProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        className={cn(error && "border-red-500")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
