import FormBody from '@/components/form/form-body';
import { FormField } from '@/components/form/form-field';
import FormHeader from '@/components/form/form-header';
import { LotesPagosForm } from '@/components/lotesPagos/lotesPagosForm';
import { AgGridTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import { useInertiaFormWrapper } from '@/hooks/form/use-form';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TableItem } from '@/types/table';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Procesos',
        href: '/procesos',
    },
];

// Define el tipo de datos inicial
interface LotesPagosData {
    id_cuenta_banco: string;
    id_sucursal: string;
    desde_fecha_pago: string | null;
    hasta_fecha_pago: string | null;
    numero_lote: string;
    buscar: string;
    [key: string]: string | null;
}

// Define los datos iniciales
const initialData: LotesPagosData = {
    id_cuenta_banco: '',
    id_sucursal: '',
    desde_fecha_pago: null,
    hasta_fecha_pago: null,
    numero_lote: '',
    buscar: '',
};

export default function LotesPagos() {
    const inertiaForm = useForm(initialData);
    const { data, errors, handleInputChange, handleComponentChange, resetForm } = useInertiaFormWrapper(inertiaForm);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

    const columnsParamValue = { programa: 'registros.seguimientos' };
    const dataParamValue = { renglon: '', desde_fecha: '20240101', tipo_reporte: '00'};

    // 3. Usa un objeto fijo para los parámetros de la tabla
    const tableParamsValue = {
        open: true,
        columnsRoute: 'traerEncabezadoRegistros',
        dataRoute: 'traerLotesPagos',
        parametrosColumna: columnsParamValue,
        parametrosDatos: dataParamValue,
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);

    const { rowData, columnDefs, defaultColDef, loading } = useAgGridData(stableTableParams);

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: TableItem) => {
        console.log('Double clicked item:', item);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inertiaForm.post('/api/lotes-pagos');
    };

    const handleClear = () => {
        resetForm(initialData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lotes de Pagos" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader title="Lotes de Pagos" onSave={() => handleSubmit(e)} onClear={handleClear} formId="lotes-pagos-form" />

                    <FormBody onSubmit={handleSubmit}>
                        <div className="space-x-4">
                            <LotesPagosForm
                                data={data}
                                errors={errors}
                                handleInputChange={handleInputChange}
                                handleComponentChange={handleComponentChange}
                                className="grid grid-cols-1 gap-4 md:grid-cols-4"
                            />

                            <div className="col-span-4 h-2 rounded-md bg-orange-500"></div>

                            {/* Campo de búsqueda */}
                            <div className="col-span-4">
                                <div className="flex gap-2">
                                    <FormField
                                        component={InputLabel}
                                        label="Buscar"
                                        id="buscar"
                                        name="buscar"
                                        data={data}
                                        errors={errors}
                                        handleInputChange={handleInputChange}
                                        handleComponentChange={handleComponentChange}
                                    />
                                    <Button type="button" className="h-9 bg-[#0066b3] hover:bg-[#005091]">
                                        Buscar
                                    </Button>
                                </div>
                            </div>

                            {/* Formulario de Lotes de Pagos */}

                            <div className="w-full h-[450px]">
                                <AgGridTable
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    loading={loading}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    selectedItem={selectedItem}
                                    onRowClick={handleRowClick}
                                    onDoubleClick={handleDoubleClick}
                                />
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>
        </AppLayout>
    );
}
