import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import FormBody from '@/components/form/form-body';
import {FormHeader} from '@/components/form/form-header';
// import { LotesPagosForm } from '@/components/lotesPagos/lotesPagosForm';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useInertiaFormWrapper } from '@/hooks/form/use-form';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TableItem } from '@/types/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        href: '/procesos',
        title: 'Procesos',
    },
];

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
    buscar: '',
    desde_fecha_pago: null,
    hasta_fecha_pago: null,
    id_cuenta_banco: '',
    id_sucursal: '',
    numero_lote: '',
};

export default function LotesPagos() {
    const inertiaForm = useForm(initialData);
    const { resetForm } = useInertiaFormWrapper(inertiaForm);

    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
    const [cargarDatosInicio, setCargarDatosInicio] = useState(false);

    const columnsParamValue = { programa: 'registros.seguimientos' };

    const dataParamValue = { desde_fecha: '20240101', renglon: '', tipo_reporte: '00'};

    const tableParamsValue = {
        columnsRoute: 'traerEncabezadoRegistros',
        dataRoute: 'traerLotesPagos',
        fetchData: cargarDatosInicio,
        isGeneric: false,
        loadColumns: true,
        parametrosColumna: columnsParamValue,
        parametrosDatos: dataParamValue
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);

    const { columnDefs, defaultColDef, loading, rowData } = useAgGridData(stableTableParams);

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: TableItem) => {
        console.log('Double clicked item:', item);
    };

    const handleSubmit = () => {
        setCargarDatosInicio(true);
    };

    const handleClear = () => {
        resetForm(initialData);
    };

    const handleAction = (action: string) => {
        console.log('Action:', action);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lotes de Pagos" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">

                    <FormHeader
                        title="Lotes de Pagos"
                        onSave={() => handleSubmit()}
                        onClear={handleClear}
                        onBack={() => window.history.back()}
                        formId="lotesPagosForm"

                        saveButtonProps={{
                            children: 'Buscar',
                            className: 'bg-indigo-600 hover:bg-indigo-700 h-8',
                            form: 'lotesPagosForm',
                            type: 'submit',
                        }}
                    >

                        <Button
                            variant="outline"
                            className="h-8"
                            onClick={() => console.log('Botón EXTRA!')}
                        >
                            Enviar a ePagos
                        </Button>

                    </FormHeader>


                    <FormBody onSubmit={handleSubmit}>
                        <div className="space-x-3 ">
                            {/* <LotesPagosForm
                                data={data}
                                errors={errors}
                                handleInputChange={handleInputChange}
                                handleComponentChange={handleComponentChange}
                                className="grid grid-cols-1 gap-4 md:grid-cols-5"
                            /> */}

                            <div className="col-span-4 h-2 rounded-md bg-orange-500 mt-2"></div>

                            {/* Formulario de Lotes de Pagos */}

                            <div className="w-full">
                                <DataTable
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    loading={loading}
                                    selectedItem={selectedItem}
                                    onRowClick={handleRowClick}
                                    onDoubleClick={handleDoubleClick}
                                    onAction={handleAction}
                                />
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>
        </AppLayout>
    );
}
