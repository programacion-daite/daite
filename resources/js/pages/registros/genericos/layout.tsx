// import FormBody from '@/components/form/form-body';
// import { FormHeader } from '@/components/form/form-header';
// import { ModalForm } from '@/components/form/dynamic-form';
// import { DynamicTable } from '@/components/table/dynamic-table';
// import { useInertiaFormWrapper } from '@/hooks/form/use-form';
// import AppLayout from '@/layouts/app-layout';
// import { TableItem } from '@/types/table';
// import { Head, useForm } from '@inertiajs/react';
// import { useState } from 'react';

// type registroDinamicoProps = {
//     tabla: string;
//     id_primario: string;
// }

// export default function RegistroDinamico({ tabla ,id_primario }: registroDinamicoProps) {
//     const inertiaForm = useForm({});
//     const { data, errors, handleInputChange, handleComponentChange, resetForm } = useInertiaFormWrapper(inertiaForm);
//     const [modalAbierto, setModalAbierto] = useState(false);

//     const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

//     const handleRowClick = (item: TableItem) => {
//         setSelectedItem(item);
//     };

//     const handleDoubleClick = (item: TableItem) => {
//         console.log('Double clicked item:', item);
//     };

//     const handleSubmit = () => {
//         setModalAbierto(true);
//     };

//     const handleClear = () => {
//         resetForm(initialData);
//     };

//     return (
//         <AppLayout>
//             <Head title="Lotes de Pagos" />
//             <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="w-full">
//                     <FormHeader
//                         title={`Registros de ${tabla}`}
//                         onSave={() => handleSubmit()}
//                         onClear={handleClear}
//                         onBack={() => window.history.back()}
//                         formId={`${tabla}Form`}
//                         saveButtonProps={{
//                             children: 'Crear',
//                         }}
//                     ></FormHeader>

//                     <FormBody onSubmit={handleSubmit}>
//                         <div className="space-x-3">

//                             <div className="w-full">
//                                 <DynamicTable tabla={tabla} id_primario={id_primario} />
//                             </div>
//                         </div>
//                     </FormBody>
//                 </div>
//             </div>

//             <ModalForm
//                 abierto={modalAbierto}
//                 onClose={() => setModalAbierto(false)}
//                 modo="crear"
//                 datosIniciales={{}}
//                 onSubmit={(datos) => console.log('Submit desde Modal:', datos)}
//                 campos={[
//                     {
//                         nombre: 'id_provincia',
//                         label: '',
//                         tipo: 'text',
//                         componente: 'InputLabel',
//                         classname: 'hidden',
//                     },
//                     {
//                         nombre: 'provincia',
//                         label: 'Provincia',
//                         tipo: 'text',
//                         componente: 'InputLabel',
//                     },
//                     {
//                         nombre: 'referencia',
//                         label: 'Referencia',
//                         tipo: 'text',
//                         componente: 'InputLabel',
//                     },
//                 ]}
//             />
//         </AppLayout>
//     );
// }
