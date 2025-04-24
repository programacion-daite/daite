// import FormBody from '@/components/form/form-body';
// import {FormHeader} from '@/components/form/form-header';
// import { DynamicSelect } from '@/components/dynamic-select';
// import { Button } from '@/components/ui/button';
// import { InputLabel } from '@/components/ui/input-label';
// import { useBeneficiarios } from '@/hooks/register/use-beneficiarios';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// import { InputWithSearch } from '@/components/input-with-search';
// import { BeneficiarioItem } from '@/types/entities';
// import MaskedInput from '@/components/ui/masked-input';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Beneficiarios',
//         href: '/beneficiarios',
//     },
// ];

// export default function Beneficiaries() {
//     const { data, setData, errors } = useBeneficiarios();

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Beneficiarios" />
//             <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="w-full">
//                     <FormHeader title="Registro de Beneficiarios" onSave={() => {}} onClear={() => {}} formId="beneficiarios-form" />

//                     <FormBody onSubmit={() => {}}>
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

//                             <DynamicSelect
//                                 id="renglon"
//                                 label="Renglon"
//                                 parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
//                                 name="renglon"
//                                 onValueChange={(valor) => setData('renglon', valor)}
//                                 error={errors.renglon}
//                             />

//                             <InputWithSearch<BeneficiarioItem>
//                                 label="Beneficiario"
//                                 id="id_cliente"
//                                 value={data.id_cliente}
//                                 displayValue={data.cliente ?? ''}
//                                 field="cliente"
//                                 table="clientes"
//                                 onChange={(value, item) => {
//                                     setData('id_cliente', value);
//                                     if (item) {
//                                         setData('cliente', item.beneficiario);
//                                     }
//                                 }}
//                                 error={errors.id_beneficiario}
//                                 className="mb-4 col-span-1"
//                             />

//                             <DynamicSelect
//                                 id="id_cuenta"
//                                 label="Cuentas"
//                                 parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
//                                 name="cuentas"
//                                 onValueChange={(valor) => setData('id_cuenta', valor)}
//                                 error={errors.id_cuenta}
//                             />

//                             <DynamicSelect
//                                 id="id_banco"
//                                 label="Banco"
//                                 parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
//                                 name="id_banco"
//                                 onValueChange={(valor) => setData('id_banco', valor)}
//                                 error={errors.id_banco}
//                             />

//                             <DynamicSelect
//                                 id="id_tipo_cuenta"
//                                 label="Tipo de Cuenta"
//                                 parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
//                                 name="id_tipo_cuenta"
//                                 onValueChange={(valor) => setData('id_tipo_cuenta', valor)}
//                                 error={errors.id_tipo_cuenta}
//                             />

//                             <DynamicSelect
//                                 id="id_moneda"
//                                 label="Moneda"
//                                 parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
//                                 name="id_moneda"
//                                 onValueChange={(valor) => setData('id_moneda', valor)}
//                                 error={errors.id_moneda}
//                             />

//                             <MaskedInput
//                                 id="numero_cuenta"
//                                 name="numero_cuenta"
//                                 value={data.numero_cuenta}
//                                 onChange={(e) => setData('numero_cuenta', e.target.value)}
//                                 maskType="number"
//                                 label="Numero de Cuenta"
//                             />


//                             <div className="col-span-4 h-2 rounded-md bg-orange-500"></div>

//                             {/* Campo de búsqueda */}
//                             <div className="col-span-4">
//                                 <div className="flex gap-2">
//                                     <InputLabel
//                                         label="Buscar"
//                                         id="buscar"
//                                         value={data.buscar}
//                                         onChange={(e) => setData('buscar', e.target.value)}
//                                         error={errors.buscar}
//                                     />
//                                     <Button type="button" className="h-9 bg-[#0066b3] hover:bg-[#005091]">
//                                         Buscar
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </FormBody>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
