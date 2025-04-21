import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form/form-field'
import { DatePicker } from '@/components/date-picker'
import { DynamicSelect } from '@/components/dynamic-select'
import { InputLabel } from '@/components/ui/input-label'
import { AsyncSearchSelect } from '@/components/async-select'
import { FormDataType } from '@/types/form'
import MaskedInput from '../ui/masked-input'
import { cn, pluralize } from '@/lib/utils'

DatePicker.displayName = 'DatePicker'
DynamicSelect.displayName = 'DynamicSelect'
InputLabel.displayName = 'InputLabel'
AsyncSearchSelect.displayName = 'AsyncSearchSelect'

interface Campo {
  nombre: string
  tipo: string
  label: string
  requerido?: boolean
  parametros?: Record<string, any>
  placeholder?: string
  componente?: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'AsyncSearchSelect' | 'MaskedInput'
  classname?: string
}

interface ModalFormProps {
  abierto: boolean
  onClose: () => void
  modo: 'crear' | 'editar'
  campos: Campo[]
  datosIniciales?: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
  title?: string
}

export const ModalForm: React.FC<ModalFormProps> = ({
  abierto,
  onClose,
  modo,
  campos,
  datosIniciales = {},
  onSubmit,
  title = ''
}) => {
  const [formData, setFormData] = React.useState<FormDataType>({})
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({})

  useEffect(() => {
    if (modo === 'editar' && datosIniciales) {
      setFormData(datosIniciales)
    } else {
      const inicial = campos.reduce((acc, campo) => ({ ...acc, [campo.nombre]: '' }), {})
      setFormData(inicial)
    }
  }, [modo, datosIniciales, campos])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleComponentChange = (name: string) => (value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  const obtenerComponente = (nombre: string) => {
    switch (nombre) {
      case 'DynamicSelect':
        return DynamicSelect
      case 'DatePicker':
        return DatePicker
      case 'AsyncSearchSelect':
        return AsyncSearchSelect
      case 'MaskedInput':
        return MaskedInput
      default:
        return InputLabel
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className='capitalize'>
          <DialogTitle>{modo === 'crear' ? `Creación de ${title}` : `Modificacion de ${title}`}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {campos.map((campo) => {
            const Componente = obtenerComponente(campo.componente ?? 'InputLabel')
            return (
              <FormField
                key={campo.nombre}
                component={Componente}
                id={campo.nombre}
                label={campo.label}
                name={campo.nombre}
                parametros={campo.parametros}
                data={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleComponentChange={handleComponentChange}
                className={cn(campo.classname, "col-span-1")}
              />
            )
          })}
        </div>

        <div className="flex justify-between mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {modo === 'crear' ? 'Crear' : 'Guardar cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
