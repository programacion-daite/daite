import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  formId?: string;
  onBack: () => void;
  onSave?: () => void;
  onClear?: () => void;
  children?: React.ReactNode;

  backButtonProps?: Partial<ButtonProps>;
  saveButtonProps?: Partial<ButtonProps>;
  clearButtonProps?: Partial<ButtonProps>;
}

export function FormHeader({
  title,
  formId,
  onBack,
  onSave,
  onClear,
  backButtonProps = {},
  saveButtonProps = {},
  clearButtonProps = {},
  children,
}: FormHeaderProps) {
  // 1. Destructure override de children y onClick:
  const {
    children: saveOverrideChildren,
    onClick: saveOverrideOnClick,
    ...saveRest
  } = saveButtonProps;

  const {
    children: clearOverrideChildren,
    onClick: clearOverrideOnClick,
    ...clearRest
  } = clearButtonProps;

  // Props por defecto
  const defaultBack: ButtonProps = {
    variant: 'ghost',
    size: 'icon',
    className: 'bg-blue-600 text-white h-8 w-8',
  };
  const defaultSave: ButtonProps = {
    type: 'submit',
    form: formId,
    className: 'bg-green-600 hover:bg-green-700 h-8',
  };
  const defaultClear: ButtonProps = {
    className: 'bg-yellow-500 hover:bg-yellow-600 text-black h-8',
  };

  return (
    <div className="bg-[#e6f0f9] p-4 rounded-t-md flex justify-between items-center w-full">
      {/* Atrás */}
      <Button {...defaultBack} {...backButtonProps} onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h2 className="text-xl font-semibold text-[#0066b3]">{title}</h2>

      <div className="flex gap-2">
        {/* Guardar / Buscar / etc. */}
        {onSave && (
          <Button
            {...defaultSave}
            // primero el onClick final, usando el override si existe
            onClick={saveOverrideOnClick ?? onSave}
            {...saveRest}
          >
            {/* children override o por defecto */}
            {saveOverrideChildren ?? 'Guardar'}
          </Button>
        )}

        {children}

        {/* Limpiar */}
        {onClear && (
          <Button
            {...defaultClear}
            onClick={clearOverrideOnClick ?? onClear}
            {...clearRest}
          >
            {clearOverrideChildren ?? 'Limpiar'}
          </Button>
        )}
      </div>
    </div>
  );
}
