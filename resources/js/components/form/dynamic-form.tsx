import { ResultModal } from '@/components/modal/result-modal';
import { useSchemaQuery } from '@/hooks/form/use-schema-query';
import AppLayout from '@/layouts/app-layout';
import type { FormDataType } from '@/types/form';
import { TableItem } from '@/types/table';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';
import { ModalForm } from './modal-form';
import { TableProvider } from '@/contexts/tableContext';
import { DynamicTableSection } from './dynamic-table-section';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';
import { useRegisterRecordsMutation } from '@/lib/mutations';
import { useTable } from '@/contexts/tableContext';
import { ApiResponse } from '@/lib/api-client';

interface RegistroDinamicoProps {
    tabla: string;
    id_primario: string;
}

const getSuccessMessage = (mode: 'create' | 'edit' | null) => {
    if (!mode) return 'Registro Guardado Correctamente!';
    return `Registro ${mode === 'create' ? 'Creado' : 'Actualizado'} Correctamente!`;
};

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message: string }).message;
    }
    return 'Ha ocurrido un inconveniente, por favor intente nuevamente';
};

const validateEditOperation = (selectedItem: TableItem | null, primaryId: string) => {
    if (!selectedItem?.[primaryId]) {
        throw new Error('Invalid edit operation');
    }
};

export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

function RegistroDinamicoContent({ tabla, id_primario }: RegistroDinamicoProps) {
    const { data: fields, isLoading } = useSchemaQuery(tabla, id_primario);
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
        resetForm,
        setErrors
    } = useDynamicFormStore();

    const handleSubmit = useCallback(async (data: FormDataType) => {
        try {
            if (modalMode === 'edit') {
                validateEditOperation(selectedItem, id_primario);
            }

            const response = await registerRecordsMutation.mutateAsync({
                table: tabla,
                primaryId: id_primario,
                formData: data
            }) as ApiResponse<unknown>;

            if (!response.success) {
                const inputsWithErrors = response.errorData?.map(error => error.campo_enfocar) || [];
                const formErrors = inputsWithErrors.reduce((acc, field) => ({
                    ...acc,
                    [field]: 'Este campo es requerido'
                }), {});
                setErrors(formErrors);
                showError(response.error || 'Ha ocurrido un error');
                return;
            }

            showSuccess(getSuccessMessage(modalMode));
            refreshTable();

        } catch (error: unknown) {
            showError(getErrorMessage(error));
        }
    }, [modalMode, selectedItem, id_primario, showSuccess, showError, registerRecordsMutation, tabla, refreshTable, setErrors]);

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
        closeResult();
        if (result.isSuccess) {
            resetForm();
            closeModal();
        }
    }, [closeResult, closeModal, resetForm, result.isSuccess]);

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

            <ResultModal
                open={result.isOpen}
                onClose={handleCloseResult}
                title={result.isSuccess ? 'Exito' : 'Inconveniente'}
                message={result.message}
                status={result.isSuccess ? 'success' : 'error'}
            />
        </AppLayout>
    );
}
