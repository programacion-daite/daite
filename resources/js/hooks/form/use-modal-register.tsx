import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import { useInertiaFormWrapper } from '@/hooks/form/use-form';
import { TableItem } from '@/types/table';

export const useRegistroModal = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<'crear' | 'editar'>('crear');
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
  const { data, errors, handleComponentChange, handleInputChange, resetForm, setData } = useInertiaFormWrapper(useForm({}));

  const abrirModalCrear = () => {
    setModo('crear');
    resetForm({});
    setSelectedItem(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: TableItem) => {
    setModo('editar');
    setSelectedItem(item);
    setData({ ...item });
    setModalAbierto(true);
  };

  return {
    abrirModalCrear, abrirModalEditar,
    data,
    errors,
    handleComponentChange,
    handleInputChange,
    modalAbierto, modo, resetForm, selectedItem, setData, setModalAbierto
  };
};
