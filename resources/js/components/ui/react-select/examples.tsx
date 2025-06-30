import { useState } from 'react';

import type { SelectOption } from './types';

import { useFormatters, useSelectOptions } from './hooks';
import { Select, AsyncSelect } from './index';

// Ejemplo de uso básico
export const BasicSelectExample = () => {
  const [value, setValue] = useState<SelectOption | null>(undefined);

  const options: SelectOption[] = [
    { label: 'Opción 1', value: 'option1' },
    { label: 'Opción 2', value: 'option2' },
    { label: 'Opción 3', value: 'option3' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Básico</h3>
      <Select
        value={value}
        onChange={(newValue) => setValue(newValue)}
        options={options}
        placeholder="Selecciona una opción"
        isClearable
        isSearchable
      />
    </div>
  );
};

// Ejemplo de AsyncSelect
export const AsyncSelectExample = () => {
  const [value, setValue] = useState<SelectOption | null>(undefined);

  // Simular carga de opciones desde API
  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1));

    // Simular búsqueda
    const mockData: SelectOption[] = [
      { label: 'Juan Pérez', value: 'user1' },
      { label: 'María García', value: 'user2' },
    ];

    return mockData.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AsyncSelect</h3>
      <AsyncSelect
        value={value}
        onChange={(newValue) => setValue(newValue)}
        loadOptions={loadOptions}
        placeholder="Busca un usuario..."
        isClearable
        cacheOptions
      />
    </div>
  );
};

// Ejemplo con opciones agrupadas
export const GroupedSelectExample = () => {
  const [value, setValue] = useState<SelectOption | null>(undefined);
  const { formatGroupLabel } = useFormatters();
  const { createGroup } = useSelectOptions();

  const groupedOptions = [
    createGroup('Debito', [
      { label: 'Gastos', value: 'apple' },
      { label: 'Activos', value: 'orange' },
    ]),
    createGroup('Credito', [
      { label: 'Pasivos', value: 'carrot' },
      { label: 'Ingresos', value: 'lettuce' },
      { label: 'Costos', value: 'tomato' },
    ]),
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cuentas por Cobrar</h3>
      <Select
        value={value}
        onChange={(newValue) => setValue(newValue)}
        options={groupedOptions}
        placeholder="Selecciona una cuenta..."
        formatGroupLabel={formatGroupLabel}
        isClearable
      />
    </div>
  );
};

// Ejemplo con validación
export const ValidatedSelectExample = () => {
  const [value, setValue] = useState<SelectOption | null>(undefined);
  const [error, setError] = useState<string>('');

  const options: SelectOption[] = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuario', value: 'user' },
    { label: 'Invitado', value: 'guest' },
  ];

  const handleChange = (newValue: SelectOption | null) => {
    setValue(newValue);

    // Validación
    if (!newValue) {
      setError('Este campo es requerido');
    } else if (newValue.value === 'guest') {
      setError('Los invitados no tienen permisos suficientes');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select con Validación</h3>
      <Select
        value={value}
        onChange={handleChange}
        options={options}
        placeholder="Selecciona un rol..."
        error={error}
        required
        isClearable
      />
    </div>
  );
};

// Ejemplo completo con todos los componentes
export const CompleteExample = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Ejemplos de React-Select con shadcn/ui</h2>

      <BasicSelectExample />
      <AsyncSelectExample />
      <GroupedSelectExample />
      <ValidatedSelectExample />
    </div>
  );
};
