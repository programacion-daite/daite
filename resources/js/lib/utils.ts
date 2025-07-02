import { ValueFormatterParams } from 'ag-grid-community';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { DatabaseField } from '@/types/form';

import { DataType } from '@/types/table';
import { FIELDS } from '@/constants';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function numericFormat(value: number | string | number[] | string[], decimals = 0): string | string[] {
    const formatear = (formattedValue: number | string): string => {
        if (!formattedValue) formattedValue = 0;

        formattedValue = Number(String(formattedValue).replaceAll(',', ''));

        return formattedValue.toLocaleString('es-419', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
        });
    };

    return Array.isArray(value) ? value.map((formattedValue) => formatear(formattedValue)) : formatear(value);
}

export function pluralize(word: string): string {
    // Get the last few letters for analysis
    const lastLetter = word.slice(-1);
    const lastTwoLetters = word.slice(-2);
    const lastThreeLetters = word.slice(-3);
    const lastFourLetters = word.slice(-4);

    // Handle vowel endings
    if (['a', 'e', 'i', 'o', 'u'].includes(lastLetter)) {
        return word + 's';
    }

    // Handle words ending in 'y'
    if (lastLetter === 'y') {
        // If preceded by a vowel, just add 's'
        if (['ay', 'ey', 'oy', 'uy'].includes(lastTwoLetters)) {
            return word + 's';
        }
        // Otherwise replace 'y' with 'ies'
        return word.slice(0, -1) + 'ies';
    }

    // Handle words ending in 'z'
    if (lastLetter === 'z') {
        return word.slice(0, -1) + 'ces';
    }

    // Handle special cases ending in 'ion' or 'cion'
    if (lastLetter === 'n' && (lastThreeLetters === 'ion' || lastFourLetters === 'cion')) {
        return word;
    }

    // Default case - add 'es'
    return word + 'es';
}

export function capitalize(text: string, delimiter: string = ' '): string {
    const words = text.split(delimiter);
    const result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return result.join(delimiter);
}

/**
 * Builds a JSON object in the specific format required for the API
 * @param data The form data
 * @param table The table name for the operation
 * @returns An object with the structure expected by the backend
 */
export const buildGenericJSON = (data: Record<string, unknown>, table: string) => {
    const fields = Object.keys(data);
    const excludedFields = ['json', '_token'];

    const foreignFields = fields.filter(field => !field.startsWith('id_') && data[`id_${field}`]);
    // const foreignIds = foreignFields.map(field => `id_${field}`);

    // Filter fields excluding foreign descriptive fields
    const filteredFields = fields
        .filter(field => !excludedFields.includes(field))
        .filter(field => {
            // If it's a foreign descriptive field, exclude it
            if (foreignFields.includes(field)) {
                return false;
            }
            // If it's a foreign ID or any other field, include it
            return true;
        });

    // Get values corresponding to filtered fields
    const values = filteredFields
        .map((field: string, index: number) => {
            const value = data[field]?.toString() || '';

            // Remove commas in any field and replace them with a space
            const valueWithoutCommas = value.replaceAll(',', ' ').toUpperCase();

            if (index === 0) {
                return valueWithoutCommas === '' ? '0' : valueWithoutCommas;
            }

            // If value is empty, replace with empty string
            return valueWithoutCommas === '' ? '' : valueWithoutCommas;
        })
        .join(','); // Join values into a comma-separated string

    // Return JSON object
    return {
        campos: filteredFields.join(','), // Filtered fields as string
        tabla: table,
        valores: values, // Values corresponding to filtered fields as string
    };
};

// Process field from database to generate appropriate structure
export const processField = (field: DatabaseField, primaryId: string): DatabaseField => {

    if (field.titulo && field.tipo) {
        return field;
    }

    const name = field.titulo;
    const isSelector = field.selector === 'SI';
    const isPrimary = name === primaryId;
    const isVisible = field.visible === '1';
    const maxLength = field.longitud || 255;
    const isRequired = field.requerido === '1';

    let label = `${field.titulo} ${isRequired ? '*' : ''}`;
    if (isPrimary) {
        label = `ID ${label}`;
    }

    let componente: DatabaseField['componente'] = 'InputLabel';
    const tipo = field.tipo || 'text';

    if (isSelector) {
        componente = 'DynamicSelect';
    } else if (tipo === 'bit') {
        componente = 'DynamicSelect';
    } else if (tipo === 'datetime') {
        componente = 'DatePicker';
    } else if (tipo === 'numeric') {
        componente = 'MaskedInput';
    } else if (/telefono|celular|whatsapp|cedula|rnc|identificacion/i.test(name || '')) {
        componente = 'MaskedInput';
    }

    let parametros: Record<string, unknown> = {};

    if (componente === 'DynamicSelect') {
        if (tipo === 'bit') {
            parametros = {
                options: [
                    { label: 'No', value: '0' },
                    { label: 'Si', value: '1' },
                ],
            };
        } else {
            parametros = {
                options: field.json ? JSON.parse(field.json).map((option: { valor: string, descripcion: string }) => ({
                        label: option.descripcion,
                        value: option.valor.toString(),
                    }))
                    : [],
            };
        }
    } else if (componente === 'MaskedInput') {
        if (/telefono|celular|whatsapp/.test(name || '')) {
            parametros = { maskType: 'telefono' };
        } else if (/cedula|rnc|identificacion/.test(name || '')) {
            parametros = { maskType: 'cedula' };
        } else if (tipo === 'numeric') {
            parametros = { maskType: 'dinero' };
        } else {
            parametros = { maskType: 'entero' };
        }
    } else if (componente === 'InputLabel') {
        parametros = { maxLength: maxLength };
    }

    return {
        classname: isVisible ? 'col-span-1' : 'hidden',
        componente,
        foranea: isSelector,
        label,
        longitud: maxLength.toString(),
        nombre: name || '',
        parametros,
        requerido: field.requerido || false,
        tipo,
    };
};

export const processFields = (fields: DatabaseField[]) => {
    const primaryId = fields[0].titulo;
    return fields.map(field => processField(field, primaryId));
}

// Nueva función para procesar campos con estructura original (campo, titulo, requerido como string)
export const processFieldsFromAPI = (fields: Array<{
    campo: string;
    titulo: string;
    tipo: string;
    longitud: string;
    visible: string;
    requerido: string;
    selector: string;
    json: string;
    alineacion: string;
    [key: string]: any;
}>) => {
    const primaryId = fields[0]?.campo || '';

    return fields.map(field => {
        const isSelector = field.selector === 'SI';
        const isPrimary = field.campo === primaryId;
        const isVisible = field.visible === '1';
        const maxLength = parseInt(field.longitud) || 255;
        const isRequired = field.requerido === '1';

        let label = `${field.titulo}`;
        if (isPrimary) {
            label = `ID ${label}`;
        }

        let componente: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'MaskedInput' = 'InputLabel';
        const tipo = field.tipo || 'text';

        if (isSelector) {
            componente = 'DynamicSelect';
        } else if (tipo === 'bit') {
            componente = 'DynamicSelect';
        } else if (tipo === 'datetime') {
            componente = 'DatePicker';
        } else if (tipo === 'numeric') {
            componente = 'MaskedInput';
        } else if (/telefono|celular|whatsapp|cedula|rnc|identificacion/i.test(field.campo)) {
            componente = 'MaskedInput';
        }

        let parametros: Record<string, unknown> = {
            required: isRequired,
        };

        if (componente === 'DynamicSelect') {
            if (tipo === 'bit') {
                parametros = {
                    ...parametros,
                    options: [
                        { label: 'No', value: '0' },
                        { label: 'Si', value: '1' },
                    ],
                };
            } else {
                parametros = {
                    ...parametros,
                    options: field.json ? JSON.parse(field.json).map((option: { valor: string, descripcion: string }) => ({
                            label: option.descripcion,
                            value: option.valor.toString(),
                        }))
                        : [],
                };
            }
        } else if (componente === 'MaskedInput') {
            if (/telefono|celular|whatsapp/.test(field.campo)) {
                parametros = { ...parametros, maskType: 'telefono' };
            } else if (/cedula|rnc|identificacion/.test(field.campo)) {
                parametros = { ...parametros, maskType: 'cedula' };
            } else if (tipo === 'numeric') {
                parametros = { ...parametros, maskType: 'dinero' };
            } else {
                parametros = { ...parametros, maskType: 'entero' };
            }
        } else if (componente === 'InputLabel') {
            parametros = { ...parametros, maxLength: maxLength };
        }

        return {
            nombre: field.campo,
            label,
            tipo,
            longitud: maxLength.toString(),
            visible: isVisible,
            requerido: isRequired,
            selector: field.selector,
            json: field.json,
            alineacion: field.alineacion,
            componente,
            foranea: isSelector,
            parametros,
            classname: isVisible ? 'col-span-1' : 'hidden',
        };
    });
};

// Función para obtener el formateador de valores según el tipo de dato para la tabla
export const getValueFormatterByType = <TData, TValue>(
    tipo: DataType,
): ((params: ValueFormatterParams<TData, TValue>) => string | number | string[]) | undefined => {
    switch (tipo) {
        case 'int':
            return undefined;
        case 'numeric':
        case 'decimal':
            return (params) => numericFormat(params.value as number | string, 2);
        case 'datetime':
            return (params) => {
                if (!params.value) return '';
                return new Date(params.value as string | number | Date).toLocaleDateString();
            };
        case 'varchar':
        case 'bit':
        default:
            return undefined;
    }
};

export function focusFieldAndClear(field: string, clear: () => void) {
    if (field) {
      setTimeout(() => {
        const el = document.querySelector(`[name='${field}'], [id='${field}']`);
        if (el && typeof (el as HTMLElement).focus === 'function') {
          (el as HTMLElement).focus();
          if (typeof (el as HTMLInputElement).select === 'function') {
            (el as HTMLInputElement).select();
          }
        }
        if(clear) clear();
      }, 100);
    }
  }
