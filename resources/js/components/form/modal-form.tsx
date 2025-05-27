import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DatabaseField, FormDataType } from '@/types/form'
import { Loader2 } from 'lucide-react'
import { useForm } from '@inertiajs/react'
import { useDynamicFormStore } from '@/store/useDynamicFormStore'
import { FormField } from './form-field'
import { InputLabel } from '@/components/ui/input-label'
import { DynamicSelect } from '@/components/dynamic-select'
import { DatePicker } from '@/components/date-picker'
import { AsyncSearchSelect } from '@/components/async-select'
import MaskedInput from '@/components/ui/masked-input'

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  title: string
  initialData: FormDataType
  onSubmit: (data: FormDataType) => Promise<void>
  fields: DatabaseField[]
  disableClose?: boolean
}

const componentMap = {
  InputLabel,
  DynamicSelect,
  DatePicker,
  AsyncSearchSelect,
  MaskedInput
};

export function ModalForm({
  isOpen,
  onClose,
  mode,
  title,
  initialData,
  onSubmit,
  fields,
  disableClose = false
}: ModalFormProps) {
  const { data, setData, processing, errors, reset } = useForm<FormDataType>(initialData)
  const { setErrors, showError } = useDynamicFormStore()

  useEffect(() => {
    if (isOpen) {
      reset()
      setData(initialData)
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      await onSubmit(data)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData(e.target.name, e.target.value);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setData(e.currentTarget.name, e.currentTarget.value);
  };

  const handleComponentChange = (name: string) => (value: string) => {
    setData(name, value);
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">
            {mode === 'create' ? `Registro de ${title}` : `Actualización de ${title}`}
          </h2>
          {!disableClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const Component = componentMap[field.componente || 'InputLabel'];
            const isMaskedInput = field.componente === 'MaskedInput';

            return (
              <FormField
                key={field.nombre}
                component={Component}
                id={field.nombre}
                label={field.label}
                name={field.nombre}
                parametros={field.parametros}
                data={data}
                errors={errors}
                onChange={!isMaskedInput ? handleInputChange : undefined}
                onInput={isMaskedInput ? handleInput : undefined}
                onValueChange={handleComponentChange(field.nombre)}
                className={field.classname}
              />
            );
          })}

          <div className="flex justify-end gap-2 mt-6">
            {!disableClose && (
              <Button
                type="button"
                variant="destructive"
                onClick={onClose}
                disabled={processing}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Enviar' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
