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

const inputClassNames = "h-8 px-2 py-1 uppercase";
const errorInputClassNames = "border-red-500 focus:ring-red-500 focus:border-red-500";

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
      <Label
        htmlFor={id}
        className={cn(
          className,
          error && "text-red-500 font-medium"
        )}
      >
        {label} {(required || error) && <span className="text-red-500">*</span>}
      </Label>
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
        aria-errormessage={error ? `${id}-error` : undefined}
        className={cn(
          inputClassNames,
          error && errorInputClassNames,
          className
        )}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500 font-medium mt-1"
          role="alert"
        >
          {typeof error === 'string' ? error : 'Este campo es requerido'}
        </p>
      )}
    </div>
  );
});

InputLabel.displayName = 'InputLabel';
