import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputLabelProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label: string;
  value: string;
  error?: string | boolean;
  ref?: React.RefCallback<HTMLInputElement>;
}

export function InputLabel({
  id,
  type = "text",
  label,
  value,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  tabIndex = 1,
  autoComplete = 'nono',
  disabled = false,
  readOnly = false,
  ref,
  className,
  ...props
}: InputLabelProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && <span className="text-red-500">*</span>}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        ref={ref}
        readOnly={readOnly}
        aria-invalid={error ? "true" : "false"}
        className={cn(className, error && "border-red-500")}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
