import FormBody from '@/components/form/form-body';
import { FormHeader } from '@/components/form/form-header';
import { ResultModal } from '@/components/modal/result-modal';
import { DynamicTable } from '@/components/table/dynamic-table';
import { useRegistroModal } from '@/hooks/form/use-modal-register';
import { useEsquema } from '@/hooks/form/use-schema';
import AppLayout from '@/layouts/app-layout';
import { capitalize, construirJSONGenerico } from '@/lib/utils';
import type { RegistroDinamicoProps } from '@/types/form';
import { TableItem } from '@/types/table';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useReducer, useCallback } from 'react';
import { ModalForm } from './modal-form';
import { TableProvider, useTable } from '@/contexts/tableContext';

export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

// Definir el estado inicial y tipo
interface FormState {
    resultado: {
        abierto: boolean;
        mensaje: string;
        esExito: boolean;
    };
    formData: Record<string, unknown> | null;
    isSubmitting: boolean;
}

type FormAction =
    | { type: 'SHOW_RESULT'; mensaje: string; esExito: boolean }
    | { type: 'HIDE_RESULT' }
    | { type: 'SET_FORM_DATA'; data: Record<string, unknown> | null }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_END' };

// Reducer para manejar todos los estados relacionados con el formulario
function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SHOW_RESULT':
            return {
                ...state,
                resultado: {
                    abierto: true,
                    mensaje: action.mensaje,
                    esExito: action.esExito
                }
            };
        case 'HIDE_RESULT':
            return {
                ...state,
                resultado: {
                    ...state.resultado,
                    abierto: false
                }
            };
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: action.data
            };
        case 'SUBMIT_START':
            return {
                ...state,
                isSubmitting: true
            };
        case 'SUBMIT_END':
            return {
                ...state,
                isSubmitting: false
            };
        default:
            return state;
    }
}

function RegistroDinamicoContent({ tabla, id_primario }: RegistroDinamicoProps) {
    const { setIsLoading, refreshTable } = useTable();
    const campos = useEsquema(tabla, id_primario);
    const { modalAbierto, setModalAbierto, modo, selectedItem, abrirModalCrear, abrirModalEditar } = useRegistroModal();

    // Usar useReducer para manejar múltiples estados relacionados
    const [formState, dispatch] = useReducer(formReducer, {
        resultado: {
            abierto: false,
            mensaje: '',
            esExito: false
        },
        formData: null,
        isSubmitting: false
    });

    const titulo = `Registros de ${capitalize(tabla.replace(/_/g, ' '))}`;

    // Funciones memoizadas para evitar recreaciones innecesarias
    const mostrarResultado = useCallback((mensaje: string, esExito: boolean) => {
        dispatch({ type: 'SHOW_RESULT', mensaje, esExito });
    }, []);

    const cerrarResultado = useCallback(() => {
        dispatch({ type: 'HIDE_RESULT' });
    }, []);

    const handleSubmit = useCallback(async (datos: Record<string, unknown>) => {
        // Construir JSON para enviar
        const jsonData = construirJSONGenerico(datos, tabla);
        const params = { json: JSON.stringify(jsonData) };

        setIsLoading(true);
        dispatch({ type: 'SUBMIT_START' });

        try {
            const response = await axios.post(route('registrarRegistros'), params);
            const data = response.data[0].original[0];

            if (data.codigo_estado !== '200') {
                // ERROR - Guardar datos para preservarlos
                dispatch({ type: 'SET_FORM_DATA', data: datos });
                mostrarResultado(data.mensaje, false);
            } else {
                // ÉXITO - Limpiar todo y cerrar
                dispatch({ type: 'SET_FORM_DATA', data: null });
                mostrarResultado('Datos guardados correctamente', true);
                refreshTable();
                setModalAbierto(false);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            // ERROR - Guardar datos para preservarlos
            dispatch({ type: 'SET_FORM_DATA', data: datos });
            mostrarResultado('Error al enviar los datos. Por favor, inténtelo de nuevo.', false);
        } finally {
            setIsLoading(false);
            dispatch({ type: 'SUBMIT_END' });
        }
    }, [tabla, setIsLoading, refreshTable, setModalAbierto, mostrarResultado]);

    // Función para abrir formulario nuevo
    const handleOpenNewForm = useCallback(() => {
        dispatch({ type: 'SET_FORM_DATA', data: null });
        abrirModalCrear();
    }, [abrirModalCrear]);

    // Función para abrir formulario de edición
    const handleOpenEditForm = useCallback((item: TableItem) => {
        dispatch({ type: 'SET_FORM_DATA', data: null });
        abrirModalEditar(item);
    }, [abrirModalEditar]);

    // Función para cerrar el modal
    const handleCloseModal = useCallback(() => {
        dispatch({ type: 'SET_FORM_DATA', data: null });
        setModalAbierto(false);
    }, [setModalAbierto]);

    return (
        <AppLayout>
            <Head title={titulo} />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader
                        title={titulo}
                        onSave={handleOpenNewForm}
                        onClear={() => {}}
                        onBack={() => window.history.back()}
                        formId={`${tabla}Form`}
                        saveButtonProps={{ children: 'Crear' }}
                    />
                    <FormBody
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleOpenNewForm();
                        }}
                    >
                        <div className="space-x-3">
                            <div className="w-full">
                                <DynamicTable
                                    tabla={tabla}
                                    id_primario={id_primario}
                                    onRowClick={handleOpenEditForm}
                                    onDoubleClick={handleOpenEditForm}
                                />
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>

            <ModalForm
                abierto={modalAbierto}
                onClose={handleCloseModal}
                modo={modo}
                title={tabla}
                // Si hay datos de formulario guardados, usarlos; si no, usar los del item seleccionado
                datosIniciales={formState.formData || selectedItem || {}}
                onSubmit={handleSubmit}
                campos={campos}
            />

            <ResultModal
                open={formState.resultado.abierto}
                onClose={cerrarResultado}
                titulo={formState.resultado.esExito ? 'Éxito' : 'Error'}
                mensaje={formState.resultado.mensaje}
                status={formState.resultado.esExito ? 'success' : 'error'}
            />
        </AppLayout>
    );
}
