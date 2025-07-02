import { Head, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { SUCCESS_TITLES } from '@/constants';
import { TableProvider } from '@/contexts/tableContext';
import { useDynamicFormModal } from '@/hooks/form/use-dynamic-form-modal';
import { capitalize, focusFieldAndClear } from '@/lib/utils';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';

const DynamicTableSection = lazy(() => import('@/components/form/dynamic-table-section'));
// const ModalForm = lazy(() => import('@/components/form/modal-form'));
const ModalFormInertia = lazy(() => import('@/components/form/modal-form-inertia'));
const ResultModalNew = lazy(() => import('@/components/modal/result-modal-new'));

export default function RegistroDinamico() {
    return (
        <TableProvider>
            <RegistroDinamicoContent />
        </TableProvider>
    );
}

function RegistroDinamicoContent() {
    const props = usePage().props;
    const table = (props.table as string);
    const primaryId = (props.primaryId as string);
    const registerName = table.replace(/_/g, ' ');

    const {
        handleCloseModal,
        handleCloseResult: handleCloseResultOrig,
        handleOpenEditForm,
        handleOpenNewForm,
        isModalOpen,
        modalMode,
        result,
        initialData,
    } = useDynamicFormModal();

    const { focusField, clearFocusField } = useDynamicFormStore();

    const handleCloseResult = () => {
        handleCloseResultOrig();
        focusFieldAndClear(focusField, clearFocusField);
    };

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

            {isModalOpen && (
                <ModalFormInertia
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    mode={modalMode || 'create'}
                    title={registerName}
                    initialData={initialData}
                    disableClose={result.isOpen}
                    isLoading={false}
                />
            )}

            <Suspense fallback={<Loader2 className="animate-spin" />}>
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
