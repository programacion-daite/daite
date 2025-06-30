import { useCallback } from 'react';

import type { SelectOption, SelectOptionGroup } from './types';

export const useFormatters = () => {
  const formatCreateLabel = useCallback((label: string) => (
    <span className="text-sm">
      Agregar <span className="font-semibold">{`"${label}"`}</span>
    </span>
  ), []);

  const formatGroupLabel = useCallback((data: SelectOptionGroup) => (
    <div className="flex justify-between items-center">
      <span>{data.label}</span>
      <span className="rounded-md text-xs font-normal text-secondary-foreground bg-secondary shadow-sm px-1">
        {data.options.length}
      </span>
    </div>
  ), []);

  return {
    formatCreateLabel,
    formatGroupLabel
  };
};


/**
 * Hook para validar opciones nuevas en CreatableSelect
 */
export const useCreatableValidation = () => {
  const isValidNewOption = (
    inputValue: string,
    value: SelectOption[],
    options: SelectOption[]
  ) => {
    // No permitir opciones vacías
    if (!inputValue.trim()) return false;

    // No permitir duplicados
    const isDuplicate = [...value, ...options].some(
      option => option.label.toLowerCase() === inputValue.toLowerCase()
    );

    return !isDuplicate;
  };

  return { isValidNewOption };
};

/**
 * Hook para crear opciones con datos adicionales
 */
export const useSelectOptions = () => {
  const createOption = (
    value: string,
    label: string,
    data?: Record<string, unknown>
  ): SelectOption => ({
    data,
    label,
    value
  });

  const createGroup = (
    label: string,
    options: SelectOption[]
  ): SelectOptionGroup => ({
    label,
    options
  });

  return { createGroup, createOption };
};

/**
 * Hook para filtrar opciones
 */
export const useSelectFilter = () => {
  const filterOptions = (
    options: SelectOption[],
    searchTerm: string
  ): SelectOption[] => {
    if (!searchTerm) return options;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return options.filter(option =>
      option.label.toLowerCase().includes(lowerSearchTerm) ||
      option.value.toLowerCase().includes(lowerSearchTerm)
    );
  };

  return { filterOptions };
};
