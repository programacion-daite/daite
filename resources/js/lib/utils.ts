import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CampoBaseDatos } from '@/types/form';
import { TipoDato } from '@/types/table';
import { ValueFormatterParams } from 'ag-grid-community';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function numericFormat(value: any, decimals = 0) {

    const formatear = (formattedValue : any) => {

      if (!formattedValue)
        formattedValue = 0
      ;

      formattedValue = Number(
        String(formattedValue).replaceAll(',', '')
      );

      return formattedValue.toLocaleString('es-419', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })

    };

    return Array.isArray(value)
      ? value.map((formattedValue) => formatear(formattedValue))
      : formatear(value)

  }

export function pluralize(palabra: string): string {

    // ! Declaración de variables
    let
      palabraPluralizada = null,
      ultimaLetra = null,
      penultimaLetra = null,
      antepenultimaLetra = null,
      trasantepenultimaLetra = null,
      letraAntesY = null,
      letraAntesZ = null;

    // ! Asignando valores
    ultimaLetra = palabra.slice(-1);
    penultimaLetra = palabra.slice(-2);
    antepenultimaLetra = palabra.slice(-3);
    trasantepenultimaLetra = palabra.slice(-4);

    // !
    if (
      ultimaLetra === "a" ||
      ultimaLetra === "e" ||
      ultimaLetra === "i" ||
      ultimaLetra === "o" ||
      ultimaLetra === "u"
    ) {

      // + Asignando valor
      palabraPluralizada = palabra + "s"

    }
    // !
    else if (ultimaLetra === "y") {

      // +
      if (
        penultimaLetra === "ay" ||
        penultimaLetra === "ey" ||
        penultimaLetra === "oy" ||
        penultimaLetra === "uy"
      ) {

        // ? Asignando valor
        palabraPluralizada = palabra + "s"

      }
      // +
      else {

        // ? Asignando valor
        letraAntesY = palabra.slice(0, -1);

        // ? Asignando valor
        palabraPluralizada = letraAntesY + "ies"

      }

    }
    // !
    else if (ultimaLetra === "z") {

      // + Asignando valor
      letraAntesZ = palabra.slice(0, -1);

      // + Asignando valor
      palabraPluralizada = letraAntesZ + "ces"

    }
    // !
    else if (
        ultimaLetra === "n" && (
          antepenultimaLetra === "ión" ||
          trasantepenultimaLetra === "ción"
    )) {

      // + Asignando valor
      palabraPluralizada = palabra

    }
    // !
    else {

      // + Asignando valor
      palabraPluralizada = palabra + "es"

    }

    return palabraPluralizada

}

export function capitalize(texto: string, delimitador: string = ' '): string {
    const palabras = texto.split(delimitador);
    const resultado = palabras.map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    );
    return resultado.join(delimitador);
}

/**
 * Construye un objeto JSON en el formato específico requerido para el API
 * @param datos Los datos del formulario
 * @param tabla El nombre de la tabla para la operación
 * @returns Un objeto con la estructura esperada por el backend
 */
export const construirJSONGenerico = (datos: Record<string, any>, tabla: string) => {
    const campos = Object.keys(datos);

    const camposExcluidos = ['json', '_token'];

    const camposFiltrados = campos.filter(campo => !camposExcluidos.includes(campo));

    // Obtener los valores correspondientes a los campos filtrados
    const valores = camposFiltrados
        .map((campo: string, index: number) => {
            const valor = datos[campo]?.toString() || '';

            // Eliminar comas en cualquier campo y reemplazarlas por un espacio
            const valorSinComas = valor.replaceAll(",", " ").toUpperCase();

            if(index === 0) {
                return valorSinComas === '' ? '0' : valorSinComas;
            }

            // Si el valor está vacío, reemplazarlo por "0"
            return valorSinComas === '' ? '' : valorSinComas;
        })
        .join(","); // Unir los valores en una cadena separada por comas

    // Retornar el objeto JSON
    return {
        tabla: tabla,
        campos: camposFiltrados.join(","), // Campos filtrados como string
        valores: valores, // Valores correspondientes a los campos filtrados como string
    };
};

// Procesar campo desde la base de datos para generar estructura adecuada
export const procesarCampo = (campo: any, id_primario: string): CampoBaseDatos => {
    // Si el campo ya tiene todas las propiedades, lo devolvemos
    if (campo.nombre && campo.label && campo.tipo) {
        return campo;
    }

    // Normalizar el nombre del campo
    const nombre = campo.nombre || campo.id || '';
    const esForanea = nombre.startsWith('id_') && nombre !== id_primario;
    const esPrimaria = nombre === id_primario;

    // Obtener label del campo
    let label = campo.titulo || capitalize(nombre.replace('id_', '').replace(/_/g, ' '));
    if (esPrimaria) {
        label = `ID ${label}`;
    }

    // Determinar tipo de componente
    let componente: any = 'InputLabel';
    const tipo = campo.tipo || 'text';

    if (esForanea) {
        componente = 'DynamicSelect';
    } else if (tipo === 'bit') {
        componente = 'DynamicSelect';
    } else if (tipo === 'datetime') {
        componente = 'DatePicker';
    } else if (/telefono|celular|whatsapp|cedula|rnc|identificacion/i.test(nombre)) {
        componente = 'MaskedInput';
    }

    // Determinar tabla de referencia para campos foráneos
    let tablaReferencia = '';
    if (esForanea) {
        tablaReferencia = pluralize(nombre.replace('id_', ''));
    }

    // Configurar parámetros para componentes específicos
    let parametros: Record<string, any> = {};

    if (componente === 'DynamicSelect') {
        if (tipo === 'bit') {
            parametros = {
                options: [
                    { value: '0', label: 'No' },
                    { value: '1', label: 'Si' }
                ]
            };
        } else if (tablaReferencia) {
            parametros = {
                isGeneric: true,
                table: tablaReferencia,
                id: `id_${tablaReferencia.replace(/s$/, '')}`
            };
        }
    } else if (componente === 'MaskedInput') {
        if (/telefono|celular|whatsapp/.test(nombre)) {
            parametros = { mask: 'telefono' };
        } else if (/cedula|rnc|identificacion/.test(nombre)) {
            parametros = { mask: 'cedula' };
        } else {
            parametros = { mask: 'entero' };
        }
    }

    // Crear estructura del campo
    return {
        nombre,
        tipo,
        label,
        componente,
        foranea: esForanea,
        tabla_referencia: tablaReferencia,
        parametros,
        classname: esPrimaria ? 'hidden' : 'col-span-1',
        requerido: campo.requerido || false
    };
};


// Función para obtener el formateador de valores según el tipo de dato para la tabla
export const getValueFormatterByType = <TData, TValue>(tipo: TipoDato): ((params: ValueFormatterParams<TData, TValue>) => string | number) | undefined => {
    switch (tipo) {
        case 'int':
            //!! TODO: No se formatea el valor para enteros (params) => parseInt(params.value as string).toString()
            return undefined;
        case 'numeric':
            return (params) => numericFormat(params.value as number | string, 2);
        case 'datetime':
            return (params) => {
                if (!params.value) return '';
                return new Date(params.value as string | number | Date).toLocaleDateString();
            };
        case 'date':
            return (params) => {
                if (!params.value) return '';
                return new Date(params.value as string | number | Date).toLocaleDateString('en-GB').replaceAll('.', '/');
            };
        case 'string':
        default:
            return undefined;
    }
};
