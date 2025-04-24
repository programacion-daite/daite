// // components/InputWithSearch.tsx
// import { InputLabel } from '@/components/ui/input-label';
// import { ModalBusqueda } from '@/components/search-modal';
// import { useState } from 'react';
// import axios from 'axios';
// import MaskedInput from './ui/masked-input';

// interface InputWithSearchProps<T extends Record<string, unknown>> {
//     label: string;
//     id: string;
//     value: string;
//     displayValue?: string;
//     table?: string;
//     field: string;
//     filter?: string;
//     idField?: string;
//     displayField?: string;
//     onChange: (value: string, item?: T) => void;
//     error?: string;
//     className?: string;
// }

// export function InputWithSearch<T extends Record<string, unknown>>({
//     label,
//     id,
//     value,
//     displayValue,
//     field,
//     table,
//     idField = id,
//     displayField = id.split('_')[1],
//     onChange,
//     filter,
//     error,
//     className
// }: InputWithSearchProps<T>) {
//     const [description, setDescription] = useState(displayValue || '');

//     const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const safeValue = e.target.value || '';
//         onChange(safeValue);
//     };

//     const buscarEntidad = async (idValue: string) => {
//         if (!idValue) {
//             setDescription('');
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 route('traerUnicaEntidad'),
//                 { renglon: field, filtro: filter, id_renglon: idValue},
//                 { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
//             );

//             if (response.data[0]?.original?.[0]) {
//                 const item = response.data[0].original[0] as T;
//                 setDescription(item[displayField] as string || '');
//                 onChange(idValue, item);
//             } else {
//                 setDescription('');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setDescription('');
//         }
//     };

//     const handleFocusOut = () => {
//         buscarEntidad(value);
//     };

//     const handleSelection = (item: Record<string, unknown>) => {
//         const typedItem = item as T;
//         const newValue = String(typedItem[idField]);
//         buscarEntidad(newValue);
//     };

//     return (
//         <div className={className}>
//             <div className="flex">
//                 <div className="w-[50px]">
//                     <MaskedInput
//                         maskType="numeros"
//                         value={value || ''}
//                         type="text"
//                         onInput={handleIdChange}
//                         onBlur={handleFocusOut}
//                         id={id}
//                         label={label}
//                         error={error}
//                     />
//                 </div>
//                 <div className="flex flex-1">
//                     <div className="flex-1">
//                         <InputLabel
//                             label="&nbsp;"
//                             value={description}
//                             readOnly
//                             className="w-full rounded-l-none bg-gray-50 pointer-events-none"
//                         />
//                     </div>
//                     <ModalBusqueda
//                         title={label}
//                         table={table || ''}
//                         field={field}
//                         onSelect={handleSelection}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
