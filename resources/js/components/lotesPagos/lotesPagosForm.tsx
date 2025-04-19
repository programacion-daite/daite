import React from 'react';
import { FormField } from '@/components/form/form-field';
import { DatePicker } from '@/components/date-picker';
import { DynamicSelect } from '@/components/dynamic-select';
import { InputLabel } from '@/components/ui/input-label';
import { FormDataType } from '@/types/form';
import { AsyncSearchSelect } from '@/components/async-select';

// Aseguramos que los componentes tengan displayName
DatePicker.displayName = 'DatePicker';
DynamicSelect.displayName = 'DynamicSelect';
InputLabel.displayName = 'InputLabel';

interface LotesPagosFormProps {
    data: FormDataType;
    errors: Record<string, string | undefined>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleComponentChange: (name: string) => (value: any) => void;
    className?: string;
  }

  export function LotesPagosForm({
    data,
    errors,
    handleInputChange,
    handleComponentChange,
    className
  }: LotesPagosFormProps) {
    return (
      <div className={className}>
        <FormField
          component={DynamicSelect}
          id="id_cuenta_banco"
          label="Cuenta de Banco"
          parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
          name="id_cuenta_banco"
          data={data}
          errors={errors}
          handleInputChange={handleInputChange}
          handleComponentChange={handleComponentChange}
          className="col-span-1 md:col-span-1"
        />

        <FormField
          component={DynamicSelect}
          id="id_sucursal"
          label="Sucursal"
          parametros={{ renglon: 'SUCURSALES' }}
          name="id_sucursal"
          data={data}
          errors={errors}
          handleInputChange={handleInputChange}
          handleComponentChange={handleComponentChange}
        className="col-span-1 md:col-span-1"
        />

{/* <FormField
  component={AsyncSearchSelect}
  label="Cuenta de Banco"
  name="id_cuenta_banco"
  data={data}
  errors={errors}
  handleInputChange={handleInputChange}
//   handleComponentChange={handleComponentChange}
  parametros={{ renglon: 'SUCURSALES' }}
  placeholder="Busca una cuenta..."
  onValueChange={(opt) => handleComponentChange('id_cuenta_banco')(opt?.value)}
/> */}

        <FormField
          component={DatePicker}
          label="Desde"
          name="desde_fecha_pago"
          data={data}
          errors={errors}
          handleInputChange={handleInputChange}
          handleComponentChange={handleComponentChange}
          className="col-span-1 md:col-span-1"
        />

        <FormField
          component={DatePicker}
          label="Hasta"
          name="hasta_fecha_pago"
          data={data}
          errors={errors}
          handleInputChange={handleInputChange}
          handleComponentChange={handleComponentChange}
          className="col-span-1 md:col-span-1"
        />

        <FormField
          component={InputLabel}
          label="Número de Lote"
          name="numero_lote"
          data={data}
          errors={errors}
          handleInputChange={handleInputChange}
          handleComponentChange={handleComponentChange}
          className="col-span-1 md:col-span-1"
        />
      </div>
    );
  }
