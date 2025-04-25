import React from 'react';
import { FormHeader } from '@/components/form/form-header';
import FormBody from '@/components/form/form-body';
import { DynamicTable } from '@/components/table/dynamic-table';
import type { RegistroDinamicoProps } from '@/types/form';
import type { TableItem } from '@/types/table';

interface Props extends RegistroDinamicoProps {
  titulo: string;
  campos: any[];
  onCreate: () => void;
  onEdit: (item: TableItem) => void;
}

export function RegistroTable({ titulo, onCreate, onEdit, tabla, id_primario, campos }: Props) {
  return (
    <>
      <FormHeader
        title={titulo}
        onSave={onCreate}
        onClear={() => {}}
        onBack={() => window.history.back()}
        formId={`${tabla}Form`}
        saveButtonProps={{ children: 'Crear' }}
      />
      <FormBody onSubmit={e => { e.preventDefault(); onCreate(); }}>
        <DynamicTable
          tabla={tabla}
          id_primario={id_primario}
          onRowClick={onEdit}
          onDoubleClick={onEdit}
        />
      </FormBody>
    </>
  );
}