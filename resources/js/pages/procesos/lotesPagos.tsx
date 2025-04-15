import FormBody from '@/components/form/form-body';
import FormHeader from '@/components/form/form-header';
import { DynamicSelect } from '@/components/dynamic-select';
import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import { useBeneficiarios } from '@/hooks/register/use-beneficiarios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';
import { DataTable } from '@/components/table/data-table';
import { useState } from 'react';
import { useDataTable } from '@/hooks/modal/use-data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Procesos',
        href: '/procesos',
    },
];

export default function LotesPagos() {
    const { data, setData, errors } = useBeneficiarios();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: lotesPagos, tableColumns } = useDataTable({table: 'clientes', field: 'cliente', open: true });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lotes de Pagos" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader title="Lotes de Pagos" onSave={() => {}} onClear={() => {}} formId="lotes-pagos-form" />

                    <FormBody onSubmit={() => {}}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                            <DynamicSelect
                                id="id_cuenta_banco"
                                label="Cuenta de Banco"
                                parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
                                name="id_cuenta_banco"
                                onValueChange={(valor) => setData('renglon', valor)}
                                error={errors.renglon}
                            />

                            <DynamicSelect
                                id="id_sucursal"
                                label="Sucursal"
                                parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
                                name="id_sucursal"
                                onValueChange={(valor) => setData('renglon', valor)}
                                error={errors.renglon}
                            />

                            <DatePicker
                                label="Desde"
                                onSelect={(date) => setData('desde_fecha_pago', date.toISOString())}
                            />

                            <DatePicker
                                label="Hasta"
                                onSelect={(date) => setData('hasta_fecha_pago', date.toISOString())}
                            />

                            <InputLabel
                                label="Número de Lote"
                                value={data.numero_lote}
                                onChange={(e) => setData('numero_lote', e.target.value)}
                                error={errors.numero_lote}
                            />

                            <div className="col-span-4 h-2 rounded-md bg-orange-500"></div>

                            {/* Campo de búsqueda */}
                            <div className="col-span-4">
                                <div className="flex gap-2">
                                    <InputLabel
                                        label="Buscar"
                                        id="buscar"
                                        value={data.buscar}
                                        onChange={(e) => setData('buscar', e.target.value)}
                                        error={errors.buscar}
                                    />
                                    <Button type="button" className="h-9 bg-[#0066b3] hover:bg-[#005091]">
                                        Buscar
                                    </Button>
                                </div>
                            </div>

                        <div className="col-span-4">
                            <DataTable
                                data={lotesPagos}
                                columns={tableColumns}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedItem={null}
                                onRowClick={() => {}}
                                onDoubleClick={() => {}}
                            />
                        </div>

                        </div>
                    </FormBody>
                </div>
            </div>
        </AppLayout>
    );
}
