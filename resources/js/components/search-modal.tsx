// src/components/modal/ModalBusqueda.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { ModalBusquedaProps, TableItem } from '@/types/table';
import { useModalBusqueda } from '@/hooks/modal/use-modal-busqueda';
import { useDataTable } from '@/hooks/modal/use-data-table';
import { DataTable } from '@/components/table/data-table';

export function ModalBusqueda({ title, table, field, onSelect }: ModalBusquedaProps) {
  const {
    searchTerm,
    setSearchTerm,
    open,
    setOpen,
    selectedItem,
    setSelectedItem,
  } = useModalBusqueda();

  const { data, tableColumns } = useDataTable({ open, table, field });

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRowClick = (item: TableItem) => {
    setSelectedItem(item);
  };

  const handleDoubleRowClick = (item: TableItem) => {
    setSelectedItem(item);
    handleSelect();
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedItem(null);
    setSearchTerm('');
  };


  return (
    <>
      {/* Botón para abrir el modal */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="mt-6 h-9 w-9 shrink-0 rounded-l-none bg-blue-600 text-white hover:bg-blue-800"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-4 w-[90vw] max-w-4xl max-h-[90vh] overflow-auto shadow-lg">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Búsqueda */}
            <div className="mb-4">
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
                // icon={<Search className="w-4 h-4 text-muted-foreground" />}
              />
            </div>

            {/* Tabla */}
            <DataTable
              data={data}
              columns={tableColumns}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedItem={selectedItem}
              onRowClick={handleRowClick}
              onDoubleClick={handleDoubleRowClick}
            />

            {/* Footer */}
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSelect} disabled={!selectedItem}>
                Seleccionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}

