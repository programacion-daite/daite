import { forwardRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  error?: string | boolean;
  required?: boolean;
}

const inputClassNames = "h-8 px-2 py-1";

export const InputLabel = forwardRef<HTMLInputElement, InputLabelProps>(({
  id,
  type = "text",
  label,
  value,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  tabIndex = 1,
  autoComplete = 'off',
  disabled = false,
  readOnly = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-2 input-label">
      <Label htmlFor={id} className={className}>{label} {required && <span className="text-red-500">*</span>}</Label>
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
        className={cn(className, error && "border-red-500", inputClassNames)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

InputLabel.displayName = 'InputLabel';
