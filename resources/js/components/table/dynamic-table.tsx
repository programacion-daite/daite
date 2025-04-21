// Dynamic Table.tsx

import React, { useState } from 'react';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import { AgGridTable } from './data-table';
import { TableItem } from '@/types/table';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';

type DynamicTableProps = {
    tabla?: string;
    id_primario?: string;
};

export const DynamicTable = ({tabla, id_primario}: DynamicTableProps) => {
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

   // Los parametros de las columnas
    const columnsParamValue = {
        tabla: tabla
    };

    // Los parametros de los datos
    const dataParamValue = {
        origen_registros: tabla,
        campo_ordenar: id_primario
    };

    const tableParamsValue = {
        loadColumns: true,
        columnsRoute: 'esquema',
        fetchData: true,
        dataRoute: 'registrosConsultaPrincipal',
        parametrosColumna: columnsParamValue,
        parametrosDatos: dataParamValue,
        isGeneric: true,
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);

    const {
        rowData,
        columnDefs,
        defaultColDef,
        loading,
        gridOptions
    } = useAgGridData(stableTableParams);

  const handleRowClick = (item: TableItem) => {
    console.log('Fila seleccionada:', item);
    setSelectedItem(item);
  };

  const handleRowDoubleClick = (item: TableItem) => {
    alert(`Doble clic en: ${item.nombre}`);
  };

  return (
    <div>
      <AgGridTable
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        loading={loading}
        selectedItem={selectedItem}
        onRowClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
      />
    </div>
  );
};

