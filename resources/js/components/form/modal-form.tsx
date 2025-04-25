import React, { useEffect, useCallback, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/date-picker'
import { DynamicSelect } from '@/components/dynamic-select'
import { InputLabel } from '@/components/ui/input-label'
import { AsyncSearchSelect } from '@/components/async-select'
import { FormDataType } from '@/types/form'
import MaskedInput from '../ui/masked-input'
import { Save, PlusCircle, X, CheckCircle } from 'lucide-react'
import { FormFieldWrapper } from './form-field-wrapper'

type ComponentValue = string | number | boolean | null | undefined;

interface Campo {
  nombre: string
  tipo: string
  label: string
  requerido?: boolean
  parametros?: Record<string, unknown>
  placeholder?: string
  componente?: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'AsyncSearchSelect' | 'MaskedInput'
  classname?: string
}

interface ModalFormProps {
  abierto: boolean
  onClose: () => void
  modo: 'crear' | 'editar'
  campos: Campo[]
  datosIniciales?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => void
  title?: string
}

// Memoizar el mapeo de componentes para evitar recreación
const componentMap = {
  DynamicSelect,
  DatePicker,
  AsyncSearchSelect,
  MaskedInput,
  InputLabel
} as const;

export const ModalForm: React.FC<ModalFormProps> = React.memo(({
  abierto,
  onClose,
  modo,
  campos,
  datosIniciales = {},
  onSubmit,
  title = ''
}) => {
  const [formData, setFormData] = React.useState<FormDataType>({})
  const [errors] = React.useState<Record<string, string | undefined>>({})

  // Inicializar formData
  useEffect(() => {
    if (modo === 'editar' && datosIniciales && Object.keys(datosIniciales).length > 0) {
      setFormData(datosIniciales)
    } else if (modo === 'crear') {
      const initialData = campos.reduce<FormDataType>((acc, c) => {
        // Asegurarnos de que los campos iniciales tengan un valor válido
        acc[c.nombre] = datosIniciales[c.nombre] || '';
        return acc;
      }, {});
      setFormData(initialData)
    }
  }, [datosIniciales, modo, abierto, campos])

  // Memoizar los handlers
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleComponentChange = useCallback((name: string) => (value: ComponentValue) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (Object.keys(errors).length === 0) {
      onSubmit(formData)
    }
  }, [onSubmit, formData, errors])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // Memoizar la creación de campos
  const fields = useMemo(() => campos.map(campo => {
    const Component = campo.componente ? componentMap[campo.componente] : InputLabel;

    return (
      <FormFieldWrapper
        key={campo.nombre}
        component={Component}
        id={campo.nombre}
        label={campo.label}
        name={campo.nombre}
        parametros={campo.parametros}
        data={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleComponentChange={handleComponentChange}
        className={campo.classname}
      />
    )
  }), [campos, formData, errors, handleInputChange, handleComponentChange])

  return (
    <Dialog open={abierto} onOpenChange={handleClose}>
      <DialogContent className="max-w-md md:max-w-lg rounded-lg overflow-hidden p-0 gap-0 [&>button:last-child]:hidden">
        <DialogHeader className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
          <DialogTitle className="text-xl font-medium flex items-center gap-2 capitalize">
            {modo === 'crear'
              ? <><PlusCircle className="h-5 w-5"/> Creación de {title}</>
              : <><Save className="h-5 w-5"/> Modificación de {title}</>
            }
          </DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 cursor-pointer hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 px-3 pb-2">
          {fields}
        </div>

        <div className="flex justify-between items-center gap-3 p-3 border-t border-gray-100 bg-gray-50">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r cursor-pointer from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-colors flex items-center gap-2"
          >
            {modo === 'crear'
              ? <><PlusCircle className="h-4 w-4"/> Crear</>
              : <><CheckCircle className="h-4 w-4"/> Guardar</>
            }
          </Button>

          <Button
            variant="outline"
            onClick={handleClose}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
