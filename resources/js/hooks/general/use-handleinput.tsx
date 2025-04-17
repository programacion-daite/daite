import {useCallback} from 'react'


// Hook para manejar los cambios de los inputs sin que renderize todo el componente
export const useHandleInput = (setData: (field: string, value: string) => void) => {
    const handleFieldChange = useCallback((field: string) => {
        return (value: Date | string | number | React.ChangeEvent<HTMLInputElement>) => {
            if (value instanceof Event) {
                // Si es un evento, extrae el valor
                const target = value.target as HTMLInputElement;
                setData(field, target.value);
            } else if (typeof value === 'string') {
                setData(field, value);
            } else if (typeof value === 'number') {
                setData(field, value.toString());
            } else if (value instanceof Date) {
                setData(field, value.toISOString());
            }
        };
    }, [setData]);

    return handleFieldChange;
}