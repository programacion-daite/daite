import FormBody from '@/components/form/form-body';
import {FormHeader} from '@/components/form/form-header';
import { LotesPagosForm } from '@/components/lotesPagos/lotesPagosForm';
import { AgGridTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useInertiaFormWrapper } from '@/hooks/form/use-form';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TableItem } from '@/types/table';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import ProvinciasPage from '@/components/table/dynamic-table';

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

    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: TableItem) => {
        console.log('Double clicked item:', item);
    };

    const handleSubmit = () => {
    };

    const handleClear = () => {
        resetForm(initialData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lotes de Pagos" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">

                    <FormHeader
                        title="Registro de Provincias"
                        onSave={() => handleSubmit()}
                        onClear={handleClear}
                        onBack={() => window.history.back()}
                        formId="lotesPagosForm"

                        saveButtonProps={{
                            children: 'Crear',
                        }}
                    >

                    </FormHeader>


                    <FormBody onSubmit={handleSubmit}>
                        <div className="space-x-3 ">
                            {/* Formulario de Lotes de Pagos */}

                            <div className="w-full">
                            <ProvinciasPage/>
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>
        </AppLayout>
    );
}
