import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent, RowDoubleClickedEvent,themeQuartz, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { TableItem } from '@/types/table';
import { debounce } from 'lodash';

interface AgGridTableProps {
  rowData: TableItem[];
  columnDefs: ColDef<TableItem>[];
  defaultColDef?: Record<string, unknown>;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedItem: TableItem | null;
  onRowClick: (item: TableItem) => void;
  onDoubleClick: (item: TableItem) => void;
}

export const AgGridTable = React.memo(({
  rowData,
  columnDefs,
  defaultColDef,
  loading,
  searchTerm,
  setSearchTerm,
  selectedItem,
  onRowClick,
  onDoubleClick,
}: AgGridTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  ModuleRegistry.registerModules([AllCommunityModule]);

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withParams({
        accentColor: "#005CAC",
        backgroundColor: "#FFFFFF",
        borderColor: "#03009826",
        browserColorScheme: "light",
        cellHorizontalPaddingScale: 1,
        cellTextColor: "#000000",
        fontFamily: "inherit",
        fontSize: 11,
        foregroundColor: "#000000",
        headerBackgroundColor: "#005CAC",
        headerFontFamily: [
            "-apple-system",
            "Nunito"
        ],
        headerFontSize: 11,
        headerFontWeight: 600,
        headerTextColor: "#FFFFFF",
        headerVerticalPaddingScale: 0.7,
        oddRowBackgroundColor: "#BFD6EA",
        rowVerticalPaddingScale: 0.9,
        spacing: 5
    });


  // Aplica el filtro global cuando cambia searchTerm
//   useEffect(() => {
//     if (gridApi) {
//       (gridApi as any).setQuickFilter(searchTerm);
//     }
//   }, [searchTerm, gridApi]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);

  }, []);

  // Método para manejar click en fila
  const handleRowClicked = useCallback((event: RowClickedEvent) => {
    onRowClick(event.data);
  }, [onRowClick]);

  // Método para manejar doble click en fila
  const handleRowDoubleClicked = useCallback((event: RowDoubleClickedEvent) => {
    onDoubleClick(event.data);
  }, [onDoubleClick]);

  // Mantén la fila seleccionada cuando cambien los datos
  useEffect(() => {
    if (gridApi && selectedItem) {
      const rowIndex = rowData.findIndex(item => item === selectedItem);
      if (rowIndex >= 0) {
        gridApi.forEachNode(node => {
          if (node.rowIndex === rowIndex) {
            node.setSelected(true);
          }
        });
      }
    }
  }, [selectedItem, rowData, gridApi]);

  // Función de búsqueda personalizada
  const onFilterTextBoxChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <>
      <div className="relative flex-1 rounded-md border border-gray-200 shadow-sm h-[450px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-xs">Cargando datos...</div>
          </div>
        ) : null}

        <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onRowClicked={handleRowClicked}
            onRowDoubleClicked={handleRowDoubleClicked}
            rowSelection={'single'}
            animateRows={true}
            theme={myTheme}
            domLayout="auto"
          />

      </div>
      <div className="mt-1 text-xs text-gray-500">
        Total de registros: {rowData.length}
      </div>
    </>
  );
});
