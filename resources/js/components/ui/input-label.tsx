import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputLabelProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  ref?: React.RefCallback<HTMLInputElement>;
}

export function InputLabel({
  id,
  type = "text",
  label,
  value,
  onChange,
  onInput,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  tabIndex = 1,
  autoComplete = id,
  disabled = false,
  readOnly = false,
  ref,
  className,
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
        onInput={onInput}
        placeholder={placeholder}
        ref={ref}
        readOnly={readOnly}
        aria-invalid={error ? "true" : "false"}
        className={cn(className, error && "border-red-500")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
