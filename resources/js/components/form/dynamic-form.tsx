import { ResultModal } from '@/components/modal/result-modal';
import { useRegistroModal } from '@/hooks/form/use-modal-register';
import { useEsquema } from '@/hooks/form/use-schema';
import AppLayout from '@/layouts/app-layout';
import type { RegistroDinamicoProps } from '@/types/form';
import { TableItem } from '@/types/table';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';
import { ModalForm } from './modal-form';
import { TableProvider } from '@/contexts/tableContext';
import { DynamicTableSection } from './dynamic-table-section';
import { useDynamicForm } from '@/hooks/form/use-dynamic-form';

export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    return (
        <TableProvider>
            <RegistroDinamicoContent tabla={tabla} id_primario={id_primario} />
        </TableProvider>
    );
}

function RegistroDinamicoContent({ tabla, id_primario }: RegistroDinamicoProps) {
    const campos = useEsquema(tabla, id_primario);
    const {
        modalAbierto,
        setModalAbierto,
        modo,
        selectedItem,
        abrirModalCrear,
        abrirModalEditar
    } = useRegistroModal();

    const {
        formState,
        handleSubmit,
        cerrarResultado,
        resetFormData
    } = useDynamicForm(tabla, setModalAbierto);

    // Función para abrir formulario nuevo
    const handleOpenNewForm = useCallback(() => {
        resetFormData();
        abrirModalCrear();
    }, [abrirModalCrear, resetFormData]);

    // Función para abrir formulario de edición
    const handleOpenEditForm = useCallback((item: TableItem) => {
        resetFormData();
        abrirModalEditar(item);
    }, [abrirModalEditar, resetFormData]);

    // Función para cerrar el modal
    const handleCloseModal = useCallback(() => {
        resetFormData();
        setModalAbierto(false);
    }, [setModalAbierto, resetFormData]);

    return (
        <AppLayout>
            <Head title={`Registros de ${tabla.replace(/_/g, ' ')}`} />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DynamicTableSection
                    tabla={tabla}
                    id_primario={id_primario}
                    onNewClick={handleOpenNewForm}
                    onEditClick={handleOpenEditForm}
                />
            </div>

            <ModalForm
                abierto={modalAbierto}
                onClose={handleCloseModal}
                modo={modo}
                title={tabla}
                datosIniciales={formState.formData || selectedItem || {}}
                onSubmit={handleSubmit}
                campos={campos}
                campoEnfocar={formState.campoEnfocar || undefined}
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
