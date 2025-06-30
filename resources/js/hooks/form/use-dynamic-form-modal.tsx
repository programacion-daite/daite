import { useCallback } from 'react';

import { useDynamicFormStore } from '@/store/useDynamicFormStore';
import { TableItem } from '@/types/table';

export const useDynamicFormModal = () => {
    const {
        closeModal,
        closeResult,
        isModalOpen,
        modalMode,
        openCreateModal,
        openEditModal,
        resetForm,
        result
    } = useDynamicFormStore();

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
        }
    }, [closeModal, resetForm, result.isOpen]);

    const handleCloseResult = useCallback(() => {
        closeResult();
        if (result.isSuccess) {
            resetForm();
            closeModal();
        }
    }, [closeResult, closeModal, resetForm, result.isSuccess]);

    return {
        handleCloseModal,
        handleCloseResult,
        handleOpenEditForm,
        handleOpenNewForm,
        isModalOpen,
        modalMode,
        result
    };
};