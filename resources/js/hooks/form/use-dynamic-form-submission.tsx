import { useCallback } from 'react';

import type { ApiResponse } from '@/types';
import type { FormDataType } from '@/types/form';

import { ERROR_MESSAGES } from '@/constants';
import { getSuccessMessage, getErrorMessage, validateEditOperation } from '@/lib/form-utils';
import { useRegisterRecordsMutation } from '@/lib/mutations';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';

interface UseDynamicFormSubmissionProps {
    tabla: string;
    id_primario: string;
}

export const useDynamicFormSubmission = ({
    id_primario,
    tabla
}: UseDynamicFormSubmissionProps) => {
    const registerRecordsMutation = useRegisterRecordsMutation();
    const {
        modalMode,
        selectedItem,
        setErrors,
        showError,
        showSuccess
    } = useDynamicFormStore();

    const handleSubmit = useCallback(async (data: FormDataType) => {
        try {
            if (modalMode === 'edit') {
                validateEditOperation(selectedItem, id_primario);
            }

            const response = await registerRecordsMutation.mutateAsync({
                formData: data,
                primaryId: id_primario,
                table: tabla
            }) as ApiResponse<unknown>;

            if (!response.success) {
                const inputsWithErrors = response.errorData?.map(error => error.campo_enfocar) || [];

                const firstError = response.errorData?.[0];

                const errorMessage = firstError?.mensaje
                    ? firstError.mensaje.split(':')[0]?.trim() || ERROR_MESSAGES.DEFAULT_ERROR
                    : ERROR_MESSAGES.DEFAULT_ERROR;

                const formErrors = inputsWithErrors.reduce((acc, field) => ({
                    ...acc,
                    [field]: ERROR_MESSAGES.FIELD_REQUIRED
                }), {});
                setErrors(formErrors);

                const modalErrors = inputsWithErrors.map(field => ({
                    message: ERROR_MESSAGES.FIELD_REQUIRED,
                    title: field
                }));

                showError(errorMessage, modalErrors);
                return;
            }

            showSuccess(getSuccessMessage(modalMode));

        } catch (error: unknown) {
            showError(getErrorMessage(error));
        }
    }, [modalMode, selectedItem, id_primario, showSuccess, showError, registerRecordsMutation, tabla, setErrors]);

    return {
        handleSubmit,
        isSubmitting: registerRecordsMutation.isPending
    };
};
