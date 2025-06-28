import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

import type { FormDataType } from '@/types/form';

import { SUCCESS_TITLES } from '@/constants';
import { TableProvider } from '@/contexts/tableContext';
import { useDynamicFormModal } from '@/hooks/form/use-dynamic-form-modal';
import { useDynamicFormSubmission } from '@/hooks/form/use-dynamic-form-submission';
import { useSchemaQuery } from '@/hooks/form/use-schema-query';
import { capitalize } from '@/lib/utils';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';

interface RegistroDinamicoProps {
    tabla: string;
    id_primario: string;
}

const DynamicTableSection = lazy(() => import('@/components/form/dynamic-table-section'));
const ModalForm = lazy(() => import('@/components/form/modal-form'));
const ResultModalNew = lazy(() => import('@/components/modal/result-modal-new'));

export default function RegistroDinamico({ id_primario, tabla }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

function RegistroDinamicoContent({ id_primario, tabla }: RegistroDinamicoProps) {
    const { data: fields, isLoading } = useSchemaQuery(tabla, id_primario);
    const { formData } = useDynamicFormStore();
    const registerName = tabla.replace(/_/g, ' ');

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
        id_primario,
        tabla
    });

    return (
        <>
            <Head title={`Registro de ${capitalize(registerName)}`} />

            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                    <DynamicTableSection
                        table={tabla}
                        primaryId={id_primario}
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
                        title={tabla}
                        initialData={formData as FormDataType}
                        onSubmit={handleSubmit}
                        fields={fields || []}
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
