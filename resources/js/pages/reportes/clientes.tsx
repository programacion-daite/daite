import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { DynamicSelect } from '@/components/dynamic-select';
import { useForm } from '@inertiajs/react';
import DatePicker from '@/components/date-picker';
import { DataTable } from '@/components/table/data-table';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import { useState } from 'react';
import { TableItem } from '@/types/table';

interface FormData {
    id_sucursal: string;
    id_grupo: string;
    id_ubicacion: string;
    id_categoria: string;
    tipo: string;
    id_estado: string;
    id_usuario_registro: string;
    fecha_registro: string;
    tipo_reporte: string;
    [key: string]: string;
}

export default function Clientes() {
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

    const { data, setData, processing, errors, reset } = useForm<FormData>({
        id_sucursal: '',
        id_grupo: '',
        id_ubicacion: '',
        id_categoria: '',
        tipo: '',
        id_estado: '',
        id_usuario_registro: '',
        fecha_registro: '',
        tipo_reporte: '01',
    });

    const {
        rowData,
        columnDefs,
        defaultColDef,
        loading,
        refreshData,
        refreshColumns,
    } = useAgGridData({
        loadColumns: true,
        fetchData: false,
        columnsRoute: 'reports.header',
        dataRoute: 'get.active.data',
        parametrosColumna: {
            programa: 'reportes.activos',
            tipo_reporte: data.tipo_reporte
        },
        parametrosDatos: data
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        refreshData();
        refreshColumns();
    };

    const handleReset = () => {
        reset();
        refreshData();
        refreshColumns();
    };

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: TableItem) => {
        console.log('Double clicked:', item);
    };

    return (
        <>
            <Head title="Reportes de Clientes" />

                <div className="bg-[#e6f0f9] p-4 rounded-t-md flex items-center w-full">
                    <Button variant="ghost" size="icon" className="bg-blue-600 text-white h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold text-[#0066b3] flex-grow text-center">Reportes de Activos</h2>
                </div>

            <div className="border-t-4 border-blue-800 w-full mt-1"></div>

            <form onSubmit={handleSubmit} className="p-4">
                <div className="grid grid-cols-12 gap-4">

                    <div className='col-span-3'>
                        <DynamicSelect
                            label="Sucursal"
                            id="id_sucursal"
                            name="sucursal"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "sucursales"
                                }
                            }}
                            onValueChange={(value) => setData('sucursal', value)}
                            value={data.sucursal}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.sucursal}
                        />
                    </div>

                    <div className='col-span-2'>
                        <DatePicker label="Fecha de registro" id="fecha_registro" />
                    </div>

                    <div className='col-span-3'>
                        <DynamicSelect
                            label="Grupo"
                            id="id_grupo"
                            name="grupo"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "grupos"
                                }
                            }}
                            onValueChange={(value) => setData('grupo', value)}
                            value={data.grupo}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.grupo}
                        />
                    </div>

                    <div className='col-span-2'>
                        <DynamicSelect
                            label="Ubicación"
                            id="id_ubicacion"
                            name="ubicacion"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "ubicaciones"
                                }
                            }}
                            onValueChange={(value) => setData('ubicacion', value)}
                            value={data.ubicacion}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.ubicacion}
                        />
                    </div>

                    <div className='col-span-2'>
                        <DynamicSelect
                            label="Categoria"
                            id="id_categoria"
                            name="categoria"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "categorias"
                                }
                            }}
                            onValueChange={(value) => setData('categoria', value)}
                            value={data.categoria}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.categoria}
                        />
                    </div>

                    <div className='col-span-3'>
                        <DynamicSelect
                            label="Estado"
                            id="id_estado"
                            name="estado"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "estados"
                                }
                            }}
                            onValueChange={(value) => setData('estado', value)}
                            value={data.estado}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.estado}
                        />
                    </div>

                    <div className='col-span-2'>
                        <DynamicSelect
                            label="Condicion"
                            id="id_condicion"
                            name="condicion"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    valor: (value) => value,
                                    renglon: "tipos"
                                }
                            }}
                            onValueChange={(value) => setData('tipo', value)}
                            value={data.tipo}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.tipo}
                        />
                    </div>

                    <div className='col-span-3'>
                        <DynamicSelect
                            label="Registrado por"
                            id="id_usuario_registro"
                            name="id_usuario_registro"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    renglon: "usuarios"
                                }
                            }}
                            onValueChange={(value) => setData('id_usuario_registro', value)}
                            value={data.id_usuario_registro}
                            withRefresh={false}
                            placeholder="Selecciona una opción"
                            error={errors.id_usuario_registro}
                        />
                    </div>


                </div>

                <div className="border-t-4 border-blue-800 w-full mt-2"></div>

                <div className='flex '>
                        <DynamicSelect
                            label="Tipo Reporte"
                            id="tipo_reporte"
                            name="tipo_reporte"
                            procedure={{
                                name: "p_traer_filtros",
                                params: {
                                    renglon: "tipos_reportes"
                                }
                            }}
                            onValueChange={(value) => setData('tipo_reporte', value)}
                            value={data.tipo_reporte}
                            placeholder="Selecciona una opción"
                            error={errors.tipo_reporte}
                        />
                </div>

                <div className="mt-6 flex gap-2">
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-700 hover:text-black"
                        disabled={processing}
                    >
                        {processing ? 'Procesando...' : 'Buscar'}
                    </Button>

                    <Button
                        type="reset"
                        onClick={handleReset}
                        className="bg-yellow-500 text-white hover:bg-yellow-400 hover:text-black"
                    >
                        Limpiar
                    </Button>
                </div>

            </form>

            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">

                <DataTable
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    loading={loading}
                    selectedItem={selectedItem}
                    onRowClick={handleRowClick}
                    onDoubleClick={handleDoubleClick}
                />

            </div>

        </>
    );
}
