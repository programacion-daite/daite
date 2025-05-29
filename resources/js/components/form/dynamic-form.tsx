import { ResultModal } from '@/components/modal/result-modal';
import { useSchemaQuery } from '@/hooks/form/use-schema-query';
import AppLayout from '@/layouts/app-layout';
import type { DynamicRecordProps, FormDataType } from '@/types/form';
import { TableItem } from '@/types/table';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';
import { ModalForm } from './modal-form';
import { TableProvider } from '@/contexts/tableContext';
import { DynamicTableSection } from './dynamic-table-section';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';
import { useRegisterRecordsMutation } from '@/lib/mutations';
import { useTable } from '@/contexts/tableContext';

interface RegistroDinamicoProps {
    tabla: string;
    id_primario: string;
}

export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

function RegistroDinamicoContent({ tabla, id_primario }: RegistroDinamicoProps) {
    const { data: fields, isLoading, error } = useSchemaQuery(tabla, id_primario);
    const registerRecordsMutation = useRegisterRecordsMutation();
    const { refreshTable } = useTable();

    const {
        formData,
        isModalOpen,
        modalMode,
        selectedItem,
        result,
        openCreateModal,
        openEditModal,
        closeModal,
        showSuccess,
        showError,
        closeResult,
        resetForm
    } = useDynamicFormStore();

    const handleSubmit = useCallback(async (data: FormDataType) => {
        try {
            if (modalMode === 'edit' && (!selectedItem || !selectedItem[id_primario])) {
                throw new Error('Invalid edit operation');
            }

            const response = await registerRecordsMutation.mutateAsync({
                table: tabla,
                primaryId: id_primario,
                formData: data
            }) as { message?: string };

            showSuccess(response.message || `Record ${modalMode === 'create' ? 'Created' : 'Updated'} successfully`);
            refreshTable();

        } catch (error: unknown) {
            console.log('Error occurred:', error);
            showError('Error processing request, please try again');
        }

    }, [modalMode, selectedItem, id_primario, showSuccess, showError, registerRecordsMutation, tabla, refreshTable]);

    const handleOpenNewForm = useCallback(() => {
        resetForm();
        openCreateModal();
    }, [openCreateModal, resetForm]);

    const handleOpenEditForm = useCallback((item: TableItem) => {
        resetForm();
        openEditModal(item);
    }, [openEditModal, resetForm]);

    const handleCloseModal = useCallback(() => {
        if (!result.isOpen) {
            resetForm();
            closeModal();
        } else {
            console.log('Modal not closed because result is open');
        }
    }, [closeModal, resetForm, result.isOpen]);

    const handleCloseResult = useCallback(() => {
        console.log('handleCloseResult called');
        closeResult();
        if (result.isSuccess) {
            resetForm();
            closeModal();
        }
    }, [closeResult, closeModal, resetForm, result.isSuccess]);

    if (isLoading) return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );
    if (error) return <div>Error: {error.message}</div>;
    if (!fields) return <div>No fields found</div>;

    return (
        <AppLayout>
            <Head title={`Registro de ${tabla.replace(/_/g, ' ')}`} />

            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DynamicTableSection
                    table={tabla}
                    primaryId={id_primario}
                    onNewClick={handleOpenNewForm}
                    onEditClick={handleOpenEditForm}
                />
            </div>

            <ModalForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={modalMode || 'create'}
                title={tabla}
                initialData={formData as FormDataType}
                onSubmit={handleSubmit}
                fields={fields}
                disableClose={result.isOpen}
            />

            <ResultModal
                open={result.isOpen}
                onClose={handleCloseResult}
                title={result.isSuccess ? 'Success' : 'Try again'}
                message={result.message}
                status={result.isSuccess ? 'success' : 'error'}
            />
        </AppLayout>
    );
}
