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
import { useState } from 'react';
import { ModalForm } from './modal-form';
import { TableProvider, useTable } from '@/contexts/tableContext';

export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

function RegistroDinamicoContent({ tabla, id_primario }: RegistroDinamicoProps) {
    const { setIsLoading, refreshTable } = useTable();
    const campos = useEsquema(tabla, id_primario);
    const { modalAbierto, setModalAbierto, modo, selectedItem, abrirModalCrear, abrirModalEditar } = useRegistroModal();

    const titulo = `Registros de ${capitalize(tabla.replace(/_/g, ' '))}`;
    const [resultadoModal, setResultadoModal] = useState({
        abierto: false,
        mensaje: '',
        esExito: false
    });

    const [lastErrorData, setLastErrorData] = useState<Record<string, unknown> | null>(null);

    const mostrarResultado = (mensaje: string, esExito: boolean) => {
        setResultadoModal({
            abierto: true,
            mensaje,
            esExito
        });
    };

    const handleSubmit = async (datos: Record<string, unknown>) => {
        // Construir JSON para enviar
        const jsonData = construirJSONGenerico(datos, tabla);
        const params = { json: JSON.stringify(jsonData) };

        setIsLoading(true);

        try {
            const response = await axios.post(route('registrarRegistros'), params);
            const data = response.data[0].original[0];

            if (data.codigo_estado !== '200') {
                // ERROR - Guardar datos para preservarlos
                setLastErrorData(datos);
                mostrarResultado(data.mensaje, false);
            } else {
                // ÉXITO - Limpiar todo y cerrar
                setLastErrorData(null);
                mostrarResultado('Datos guardados correctamente', true);
                refreshTable();
                setModalAbierto(false);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            // ERROR - Guardar datos para preservarlos
            setLastErrorData(datos);
            mostrarResultado('Error al enviar los datos. Por favor, inténtelo de nuevo.', false);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para abrir formulario nuevo
    const handleOpenNewForm = () => {
        setLastErrorData(null); // Limpiar siempre los datos de error al abrir nuevo formulario
        abrirModalCrear();
    };

    // Función para abrir formulario de edición
    const handleOpenEditForm = (item: TableItem) => {
        setLastErrorData(null); // Limpiar siempre los datos de error al abrir formulario de edición
        abrirModalEditar(item);
    };

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
                onClose={() => {
                    setLastErrorData(null); // Limpiar siempre al cerrar
                    setModalAbierto(false);
                }}
                modo={modo}
                title={tabla}
                // Si hay error, usar los datos del error, si no, usar los datos del item seleccionado
                datosIniciales={lastErrorData || selectedItem || {}}
                onSubmit={handleSubmit}
                campos={campos}
            />

            <ResultModal
                open={resultadoModal.abierto}
                onClose={() => setResultadoModal(prev => ({ ...prev, abierto: false }))}
                titulo={resultadoModal.esExito ? 'Éxito' : 'Error'}
                mensaje={resultadoModal.mensaje}
            />
        </AppLayout>
    );
}
