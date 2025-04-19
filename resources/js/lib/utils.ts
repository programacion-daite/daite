import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function numericFormat(value: any, decimals = 0) {

    const formatear = (formattedValue : any) => {

      if (!formattedValue)
        formattedValue = 0
      ;

      formattedValue = Number(
        String(formattedValue).replaceAll(',', '')
      );

      return formattedValue.toLocaleString('es-419', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })

    };

    return Array.isArray(value)
      ? value.map((formattedValue) => formatear(formattedValue))
      : formatear(value)

  }
