import { TableItem } from '@/types/table';

/**
 * Obtiene el mensaje de éxito basado en el modo del formulario
 */
export const getSuccessMessage = (mode: 'create' | 'edit' | null): string => {
    if (!mode) return 'Registro Guardado Correctamente!';
    return `Registro ${mode === 'create' ? 'Creado' : 'Actualizado'} Correctamente!`;
};

/**
 * Obtiene un mensaje de error formateado a partir de un error desconocido
 */
export const getErrorMessage = (error: unknown): string => {
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

/**
 * Valida que la operación de edición sea válida
 * @throws Error si la operación de edición no es válida
 */
export const validateEditOperation = (selectedItem: TableItem | null, primaryId: string): void => {
    if (!selectedItem?.[primaryId]) {
        throw new Error('Invalid edit operation');
    }
};
