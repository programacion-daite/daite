import type { ComponentProps } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface FormHeaderProps {
  title: string;
  formId?: string;
  onBack: () => void;
  onSave?: () => void;
  onClear?: () => void;
  children?: React.ReactNode;

  backButtonProps?: Partial<ComponentProps<typeof Button>>;
  saveButtonProps?: Partial<ComponentProps<typeof Button>>;
  clearButtonProps?: Partial<ComponentProps<typeof Button>>;
}

export function FormHeader({
  backButtonProps = {},
  children,
  clearButtonProps = {},
  formId,
  onBack,
  onClear,
  onSave,
  saveButtonProps = {},
  title,
}: FormHeaderProps) {
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

  const defaultBack: ComponentProps<typeof Button> = {
    className: 'bg-blue-600 text-white h-8 w-8',
    size: 'icon',
    variant: 'ghost',
  };
  const defaultSave: ComponentProps<typeof Button> = {
    className: 'bg-green-600 hover:bg-green-700 h-8',
    form: formId,
    type: 'submit',
  };
  const defaultClear: ComponentProps<typeof Button> = {
    className: 'bg-yellow-500 hover:bg-yellow-600 text-black h-8',
  };

  return (
    <div className="bg-[#e6f0f9] p-4 rounded-t-md flex justify-between items-center w-full">
      <Button {...defaultBack} {...backButtonProps} onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h2 className="text-xl font-semibold text-[#0066b3] capitalize">{title}</h2>

      <div className="flex gap-2">
        {onSave && (
          <Button
            {...defaultSave}
            onClick={saveOverrideOnClick ?? onSave}
            {...saveRest}
          >
            {saveOverrideChildren ?? 'Guardar'}
          </Button>
        )}

        {children}

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
