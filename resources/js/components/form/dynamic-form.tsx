import { Head, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

import type { DatabaseField, FormDataType } from '@/types/form';

import { SUCCESS_TITLES } from '@/constants';
import { TableProvider } from '@/contexts/tableContext';
import { useDynamicFormModal } from '@/hooks/form/use-dynamic-form-modal';
import { useDynamicFormSubmission } from '@/hooks/form/use-dynamic-form-submission';
import { capitalize, processFieldsFromAPI } from '@/lib/utils';
import { FIELDS, ENCABEZADO, DATOS } from '@/constants';

const DynamicTableSection = lazy(() => import('@/components/form/dynamic-table-section'));
const ModalForm = lazy(() => import('@/components/form/modal-form'));
const ResultModalNew = lazy(() => import('@/components/modal/result-modal-new'));

export default function RegistroDinamico() {
    return (
        <TableProvider>
            <RegistroDinamicoContent />
        </TableProvider>
    );
}

function RegistroDinamicoContent() {
    // const { data: fields, isLoading } = useSchemaQuery(tabla, id_primario);
    // const { formData } = useDynamicFormStore();
    const props = usePage().props;
    const table = (props.table as string);
    const fields = props.fields as DatabaseField[];
    const Dbfields = processFieldsFromAPI(fields.original);
    const primaryId = (props.primaryId as string);
    const formData = {};
    const isLoading = false;
    const registerName = table.replace(/_/g, ' ');

    const {
        handleCloseModal,
        handleCloseResult,
        handleOpenEditForm,
        handleOpenNewForm,
        isModalOpen,
        modalMode,
        result
    } = useDynamicFormModal();

    const { handleSubmit } = useDynamicFormSubmission({
        id_primario: primaryId,
        tabla: table
    });

    return (
        <>
            <Head title={`Registro de ${capitalize(table)}`} />

            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                    <DynamicTableSection
                        title={registerName}
                        table={table}
                        primaryId={primaryId}
                        onNewClick={handleOpenNewForm}
                        onEditClick={handleOpenEditForm}
                    />
                </Suspense>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                {isModalOpen && (
                    <ModalForm
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        mode={modalMode || 'create'}
                        title={registerName}
                        initialData={formData as FormDataType}
                        onSubmit={handleSubmit}
                        fields={Dbfields || []}
                        disableClose={result.isOpen}
                        isLoading={isLoading}
                    />
                )}
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>
                <ResultModalNew
                    open={result.isOpen}
                    onClose={handleCloseResult}
                    title={result.isSuccess ? SUCCESS_TITLES.SUCCESS : SUCCESS_TITLES.INCOMPLETE_INFO}
                    message={result.message}
                    errors={result.errors || []}
                    status={result.isSuccess ? 'success': 'error'}
                />
            </Suspense>
        </>
    );
}
