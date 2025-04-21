import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { pluralize, capitalize } from '@/lib/utils';

import FormBody from '@/components/form/form-body';
import { FormHeader } from '@/components/form/form-header';
import { ModalForm } from '@/components/form/modal-form';
import { DynamicTable } from '@/components/table/dynamic-table';
import { useInertiaFormWrapper } from '@/hooks/form/use-form';
import AppLayout from '@/layouts/app-layout';
import { TableItem } from '@/types/table';

type RegistroDinamicoProps = {
    tabla: string;
    id_primario: string;
}

type Campo = {
    nombre: string;
    tipo: string;
    label: string;
    requerido?: boolean;
    parametros?: Record<string, any>;
    placeholder?: string;
    componente?: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'AsyncSearchSelect' | 'MaskedInput';
    classname?: string;
    foranea?: boolean;
    tabla_referencia?: string;
    procedimiento?: string;
}

/**
 * Construye un objeto JSON en el formato específico requerido para el API
 * @param datos Los datos del formulario
 * @param tabla El nombre de la tabla para la operación
 * @returns Un objeto con la estructura esperada por el backend
 */
const construirJSONGenerico = (datos: Record<string, any>, tabla: string) => {
    // Obtener las claves (campos) del objeto de datos
    const campos = Object.keys(datos);

    const camposExcluidos = ['json', '_token'];

    // Filtrar campos que no deben incluirse en el JSON
    const camposFiltrados = campos.filter(campo => !camposExcluidos.includes(campo));

    // Obtener los valores correspondientes a los campos filtrados
    const valores = camposFiltrados
        .map(campo => {
            const valor = datos[campo]?.toString() || '';

            // Eliminar comas en cualquier campo y reemplazarlas por un espacio
            const valorSinComas = valor.replaceAll(",", " ");

            // Si el valor está vacío, reemplazarlo por "0"
            return valorSinComas === "" ? "0" : valorSinComas;
        })
        .join(","); // Unir los valores en una cadena separada por comas

    // Retornar el objeto JSON
    return {
        tabla: tabla,
        campos: camposFiltrados.join(","), // Campos filtrados como string
        valores: valores, // Valores correspondientes a los campos filtrados como string
    };
};


export default function RegistroDinamico({ tabla, id_primario }: RegistroDinamicoProps) {
    // Estados para manejo de datos y UI
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modo, setModo] = useState<'crear' | 'editar'>('crear');
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
    const [campos, setCampos] = useState<Campo[]>([]);
    const [titulo, setTitulo] = useState(`Registros de ${capitalize(tabla.replace(/_/g, ' '))}`);

    // Hook de formulario
    const inertiaForm = useForm({});
    const { data, errors, handleInputChange, handleComponentChange, resetForm, setData } = useInertiaFormWrapper(inertiaForm);

    // Cargar esquema de la tabla al iniciar
    useEffect(() => {
        cargarEsquema();
    }, [tabla]);

    // Función para cargar el esquema de la tabla
    const cargarEsquema = async () => {
        try {
            const response = await axios.get(route('esquema'), {
                params: { tabla }
            });

            // Procesar campos
            const camposFiltrados = response.data[0]
                .filter((campo: any) => !['id_usuario', 'fecha_registro', 'fecha_actualizado', 'id_estado'].includes(campo.nombre))
                .map((campo: any) => procesarCampo(campo));

            setCampos(camposFiltrados);
        } catch (error) {
            console.error('Error al cargar esquema:', error);
        }
    };

    // Procesar campo para generar estructura adecuada
    const procesarCampo = (campo: any): Campo => {
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
        let tipo = campo.tipo || 'text';

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
                    route: 'registrosConsultaPrincipal',
                    params: {
                        origen_registros: tablaReferencia,
                        campo_ordenar: `id_${tablaReferencia.replace(/s$/, '')}`
                    },
                    valueField: `id_${tablaReferencia.replace(/s$/, '')}`,
                    labelField: tablaReferencia.replace(/s$/, '')
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

    // Manejar clic en fila de tabla
    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
        console.log('Fila seleccionada:', item);
    };

    // Manejar doble clic en fila de tabla
    const handleDoubleClick = (item: TableItem) => {
        setSelectedItem(item);
        setModo('editar');
        setModalAbierto(true);

        // Preparar datos para modal
        const datosItem = { ...item };
        setData(datosItem);

        console.log('Editar registro:', item);
    };

    // Abrir modal para crear registro
    const handleCrear = () => {
        setModo('crear');
        resetForm({});
        setSelectedItem(null);
        setModalAbierto(true);
    };

    // Manejar envío del formulario
    const handleSubmit = (datos: Record<string, any>) => {
        console.log('Datos originales:', datos);

        // Construir el JSON en el formato requerido
        const jsonData = construirJSONGenerico(datos, tabla);

        console.log('JSON estructurado:', jsonData);

        // Preparar parámetros completos para el envío
        const params = {
            json: JSON.stringify(jsonData)
        };

        // Enviar datos al servidor
        axios.post(route('registrarRegistros'), params)
            .then(response => {

                const data =  response.data[0].original[0];

                if(data.codigo_estado !== 200) {
                    return new Error('Error al guardar los datos');
                }

                setModalAbierto(false);

                // Mostrar notificación de éxito (si tienes un sistema de notificaciones)
                // notificar('Registro guardado correctamente', 'success');

                // Refrescar la tabla
                // refreshTable();
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
                setModalAbierto(true);
            });
    };

    return (
        <AppLayout>
            <Head title={titulo} />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader
                        title={titulo}
                        onSave={handleCrear}
                        onClear={() => {}}
                        onBack={() => window.history.back()}
                        formId={`${tabla}Form`}
                        saveButtonProps={{
                            children: 'Crear',
                        }}
                    />

                    <FormBody onSubmit={(e) => {
                        e.preventDefault();
                        handleCrear();
                    }}>
                        <div className="space-x-3">
                            <div className="w-full">
                                <DynamicTable
                                    tabla={tabla}
                                    id_primario={id_primario}
                                />
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>

            <ModalForm
                abierto={modalAbierto}
                onClose={() => setModalAbierto(!modalAbierto)}
                modo={modo}
                title={tabla}
                datosIniciales={selectedItem || {}}
                onSubmit={handleSubmit}
                campos={campos}
            />
        </AppLayout>
    );
}
