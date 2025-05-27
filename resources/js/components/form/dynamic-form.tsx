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

export default function DynamicRecord({ table, primaryId }: DynamicRecordProps) {
    return (
        <TableProvider>
            <DynamicRecordContent table={table} primaryId={primaryId} />
        </TableProvider>
    );
}

function DynamicRecordContent({ table, primaryId }: DynamicRecordProps) {
    const { data: fields, isLoading, error } = useSchemaQuery(table, primaryId);
    const registerRecordsMutation = useRegisterRecordsMutation();

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
            console.log('Starting submit...');
            if (modalMode === 'edit' && (!selectedItem || !selectedItem[primaryId])) {
                throw new Error('Invalid edit operation');
            }

            const response = await registerRecordsMutation.mutateAsync({
                table: table,
                primaryId: primaryId,
                formData: data
            }) as { message?: string };

            console.log('Response received:', response);
            console.log('Current modal state:', { isModalOpen, result: result.isOpen });

            showSuccess(response.message || `Registro ${modalMode === 'create' ? 'Creado' : 'Actualizado'} correctamente`);

            console.log('After showSuccess:', { isModalOpen, result: result.isOpen });

        } catch (error: unknown) {
            console.log('Error occurred:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar la solicitud';
            showError(errorMessage);
            console.error(error);
        }
    }, [modalMode, selectedItem, primaryId, showSuccess, showError, registerRecordsMutation, table, isModalOpen, result.isOpen]);

    const handleOpenNewForm = useCallback(() => {
        resetForm();
        openCreateModal();
    }, [openCreateModal, resetForm]);

    const handleOpenEditForm = useCallback((item: TableItem) => {
        resetForm();
        openEditModal(item);
    }, [openEditModal, resetForm]);

    const handleCloseModal = useCallback(() => {
        console.log('handleCloseModal called, result.isOpen:', result.isOpen);
        if (!result.isOpen) {
            console.log('Closing modal...');
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
            <Head title={`Registro de ${table.replace(/_/g, ' ')}`} />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DynamicTableSection
                    table={table}
                    primaryId={primaryId}
                    onNewClick={handleOpenNewForm}
                    onEditClick={handleOpenEditForm}
                />
            </div>

            <ModalForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={modalMode || 'create'}
                title={table}
                initialData={formData as FormDataType}
                onSubmit={handleSubmit}
                fields={fields}
                disableClose={result.isOpen}
            />

            <ResultModal
                open={result.isOpen}
                onClose={handleCloseResult}
                title={result.isSuccess ? 'Success' : 'Error'}
                message={result.message}
                status={result.isSuccess ? 'success' : 'error'}
            />
        </AppLayout>
    );
}
