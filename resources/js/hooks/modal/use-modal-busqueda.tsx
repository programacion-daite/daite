// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {ColumnDef, Row } from '@tanstack/react-table';
// import { ColumnConfig, TableItem } from '@/types/table';

// interface UseModalBusquedaProps {
//   table: string;
//   field: string;
// }

// export function useModalBusqueda({ table, field }: UseModalBusquedaProps) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
//   const [columns, setColumns] = useState<ColumnConfig[]>([]);
//   const [data, setData] = useState<TableItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!open) return;

//     const fetchColumns = async () => {
//       try {
//         const response = await axios.post(
//           route('traerEncabezadoConsultas'),
//           { renglon: field },
//           { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
//         );

//         if (response.status !== 200) throw new Error('Error al cargar los datos');

//         const data = await response.data[0].original;

//         if (!Array.isArray(data)) {
//           throw new Error('La respuesta no es válida');
//         }

//         setColumns(data);
//       } catch (error) {
//         console.error('Error fetching columns:', error);
//       }
//     };

//     fetchColumns();
//   }, [open, field]);

//   useEffect(() => {
//     if (!open) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           route('traerEntidades'),
//           { renglon: table, filtro: '', entidad: '' },
//           { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
//         );

//         if (response.status !== 200) throw new Error('Error al cargar los datos');

//         const data = await response.data[0].original;

//         if (!Array.isArray(data)) {
//           throw new Error('La respuesta no es válida');
//         }

//         setData(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [open, table]);

//   const tableColumns = useMemo<ColumnDef<TableItem>[]>(() => {
//     return columns
//       .filter((col) => col.visible === '1')
//       .map((col) => ({
//         accessorKey: col.columna,
//         header: col.titulo,
//         meta: {
//           width: col.ancho || 'auto' // Guardamos el ancho en meta
//         },
//         cell: ({ row }: { row: Row<TableItem> }) => {
//           const value = row.getValue(col.columna);
//           return (
//             <div
//               style={{
//                 textAlign: col.alineacion as 'left' | 'center' | 'right',
//                 fontWeight: col.negrita === '1' ? 'bold' : 'normal',
//                 fontSize: '11px',
//                 lineHeight: '1.2',
//               }}
//             >
//               {value as React.ReactNode}
//             </div>
//           );
//         },
//       }));
//   }, [columns]);

//   return {
//     searchTerm,
//     setSearchTerm,
//     open,
//     setOpen,
//     selectedItem,
//     setSelectedItem,
//     columns,
//     data,
//     loading,
//     tableColumns,
//   };
// }

// // src/hooks/modal/useModalBusqueda.ts
// import { useState } from 'react';
// import { TableItem } from '@/types/table';

// export function useModalBusqueda() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

//   return {
//     searchTerm,
//     setSearchTerm,
//     open,
//     setOpen,
//     selectedItem,
//     setSelectedItem,
//   };
// }
