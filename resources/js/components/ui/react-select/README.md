# React-Select con shadcn/ui

Esta es una implementación completa de `react-select` integrada con el sistema de diseño de `shadcn/ui`. Proporciona componentes de select altamente personalizables y accesibles.

## 🚀 Características

- ✅ **Integración completa** con shadcn/ui
- ✅ **TypeScript** completamente tipado
- ✅ **Accesibilidad** (ARIA labels, navegación por teclado)
- ✅ **Validación** integrada
- ✅ **Temas** consistentes con shadcn/ui
- ✅ **Componentes personalizables**
- ✅ **Hooks útiles** para casos de uso comunes
- ✅ **Soporte para** Select básico, AsyncSelect, CreatableSelect y MultiSelect

## 📦 Instalación

```bash
npm install react-select
```

## 🎯 Uso Básico

### Select Simple

```tsx
import { Select } from '@/components/ui/react-select';
import type { SelectOption } from '@/components/ui/react-select';

const MyComponent = () => {
  const [value, setValue] = useState<SelectOption | null>(null);
  
  const options: SelectOption[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
  ];

  return (
    <Select
      value={value}
      onChange={(newValue) => setValue(newValue)}
      options={options}
      placeholder="Selecciona una opción"
      isClearable
      isSearchable
    />
  );
};
```

### AsyncSelect

```tsx
import { AsyncSelect } from '@/components/ui/react-select';

const MyAsyncComponent = () => {
  const [value, setValue] = useState<SelectOption | null>(null);

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    // Simular llamada a API
    const response = await fetch(`/api/users?search=${inputValue}`);
    const data = await response.json();
    
    return data.map((user: any) => ({
      value: user.id,
      label: user.name
    }));
  };

  return (
    <AsyncSelect
      value={value}
      onChange={(newValue) => setValue(newValue)}
      loadOptions={loadOptions}
      placeholder="Busca un usuario..."
      isClearable
      cacheOptions
    />
  );
};
```

### MultiSelect

```tsx
import { MultiSelect } from '@/components/ui/react-select';

const MyMultiComponent = () => {
  const [value, setValue] = useState<SelectOption[]>([]);

  return (
    <MultiSelect
      value={value}
      onChange={(newValue) => setValue(newValue)}
      options={options}
      placeholder="Selecciona múltiples opciones..."
      maxValues={5}
      minValues={1}
    />
  );
};
```

### CreatableSelect

```tsx
import { CreatableSelect } from '@/components/ui/react-select';

const MyCreatableComponent = () => {
  const [value, setValue] = useState<SelectOption | null>(null);

  const handleCreate = (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };
    // Aquí podrías guardar en tu base de datos
    setValue(newOption);
  };

  return (
    <CreatableSelect
      value={value}
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      placeholder="Escribe para crear..."
    />
  );
};
```

## 🎨 Personalización

### Estilos Personalizados

```tsx
import { createClassNames } from '@/components/ui/react-select';

const customClassNames = createClassNames({
  control: (state) => cn(
    'border-2',
    state.isFocused && 'border-blue-500'
  ),
  option: (state) => cn(
    'hover:bg-blue-100',
    state.isSelected && 'bg-blue-500 text-white'
  )
});

<Select
  classNames={customClassNames}
  // ... otras props
/>
```

### Componentes Personalizados

```tsx
import { components } from 'react-select';

const CustomOption = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      <img src={props.data.avatar} className="w-6 h-6 rounded-full" />
      <span>{props.data.label}</span>
    </div>
  </components.Option>
);

<Select
  components={{ Option: CustomOption }}
  // ... otras props
/>
```

## 🔧 Hooks Útiles

### useFormatters

```tsx
import { useFormatters } from '@/components/ui/react-select';

const MyComponent = () => {
  const { formatCreateLabel, formatGroupLabel } = useFormatters();

  return (
    <CreatableSelect
      formatCreateLabel={formatCreateLabel}
      formatGroupLabel={formatGroupLabel}
      // ... otras props
    />
  );
};
```

### useCreatableValidation

```tsx
import { useCreatableValidation } from '@/components/ui/react-select';

const MyComponent = () => {
  const { isValidNewOption } = useCreatableValidation();

  return (
    <CreatableSelect
      isValidNewOption={isValidNewOption}
      // ... otras props
    />
  );
};
```

## 🎯 Props Comunes

### BaseSelectProps

| Prop | Tipo | Descripción |
|------|------|-------------|
| `className` | `string` | Clase CSS para el contenedor |
| `isDisabled` | `boolean` | Deshabilita el select |
| `isLoading` | `boolean` | Muestra estado de carga |
| `isClearable` | `boolean` | Permite limpiar la selección |
| `isSearchable` | `boolean` | Permite búsqueda |
| `error` | `string` | Mensaje de error |
| `required` | `boolean` | Campo requerido |
| `placeholder` | `string` | Texto placeholder |

### Props de Accesibilidad

| Prop | Tipo | Descripción |
|------|------|-------------|
| `aria-label` | `string` | Etiqueta para screen readers |
| `aria-describedby` | `string` | ID del elemento que describe |
| `aria-invalid` | `boolean` | Indica si el campo es inválido |

## 🎨 Temas y Estilos

Los componentes utilizan las variables CSS de shadcn/ui:

- `--primary`: Color primario
- `--secondary`: Color secundario
- `--accent`: Color de acento
- `--destructive`: Color de error
- `--border`: Color de borde
- `--input`: Color de fondo del input
- `--popover`: Color de fondo del dropdown

## 🔍 Ejemplos Completos

Ver `examples.tsx` para ejemplos detallados de cada tipo de select.

## 🐛 Solución de Problemas

### El select no se ve bien
- Asegúrate de que las variables CSS de shadcn/ui estén definidas
- Verifica que Tailwind CSS esté configurado correctamente

### TypeScript errors
- Importa los tipos correctos desde `@/components/ui/react-select`
- Usa `SelectOption` para tipar tus opciones

### Problemas de accesibilidad
- Siempre proporciona `aria-label` para screen readers
- Usa `aria-describedby` para mensajes de error

## 📚 Recursos Adicionales

- [Documentación de react-select](https://react-select.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/) 
