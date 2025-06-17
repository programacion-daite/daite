import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import { Loader2, RefreshCw } from 'lucide-react';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDynamicSelect } from '@/hooks/use-dynamic-select';

interface DynamicSelectProps {
    id: string;
    label: string;
    name: string;
    defaultValue?: string;
    value?: string;
    parametros?: Record<string, string | { value: string; label: string }[]>;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    withRefresh?: boolean;
    error?: string;
    required?: boolean;
    isDependent?: boolean;
    dependentOn?: {
        selectId: string;
        valueKey: string;
    };
    procedure?: {
        name: string;
        params: {
            [key: string]: string | ((value: string) => string);
        };
    };
    tabIndex?: number;
    className?: string;
}

export const DynamicSelect = memo(function DynamicSelect({
    id,
    label,
    name,
    defaultValue,
    value,
    parametros = {},
    disabled = false,
    onValueChange,
    placeholder = 'Seleccione una opción',
    withRefresh = true,
    error,
    required = false,
    isDependent = false,
    dependentOn,
    procedure,
    tabIndex,
    className,
}: DynamicSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        options,
        isLoading,
        errorMsg,
        handleValueChange: handleSelectValueChange,
        refetch
    } = useDynamicSelect({
        id,
        parametros,
        isDependent,
        dependentOn,
        procedure,
        placeholder
    });

    const handleValueChange = (newValue: string) => {
        handleSelectValueChange(newValue);
        onValueChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
        }
        if (isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault();
        }
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Label htmlFor={id} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
                {label}
            </Label>
            <div className="flex gap-2">
                <Select
                    value={value || defaultValue}
                    onValueChange={handleValueChange}
                    disabled={disabled || isLoading}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <SelectTrigger
                        id={id}
                        name={name}
                        className="flex-1"
                        aria-label={label}
                        aria-required={required}
                        aria-invalid={!!error || !!errorMsg}
                        tabIndex={tabIndex}
                        onKeyDown={handleKeyDown}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                        onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.focus();
                        }}
                        onEscapeKeyDown={() => {
                            setIsOpen(false);
                            document.getElementById(id)?.focus();
                        }}
                    >
                        <SelectGroup>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="hover:bg-[#025DAD] hover:text-white focus:[#025DAD] focus:text-black cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {withRefresh && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer hover:text-white"
                        onClick={() => refetch()}
                        disabled={disabled || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        </div>
    );
});

DynamicSelect.displayName = 'DynamicSelect';
