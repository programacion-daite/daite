import FormBody from '@/components/form/form-body';
import FormHeader from '@/components/form/form-header';
import { DynamicSelect } from '@/components/dynamic-select';
import { ModalBusqueda } from '@/components/search-modal';
import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import { useBeneficiarios } from '@/hooks/register/use-beneficiarios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';
import { InputWithSearch } from '@/components/input-with-search';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beneficiarios',
        href: '/beneficiarios',
    },
];

export default function Beneficiaries() {
    const { data, setData, post, processing, errors, reset, handleChange } = useBeneficiarios();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beneficiarios" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader title="Registro de Beneficiarios" onSave={() => {}} onClear={() => {}} formId="beneficiarios-form" />

                    <FormBody onSubmit={() => {}}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Primera fila */}
                            <DynamicSelect
                                id="renglon"
                                label="Renglon"
                                procedimiento="p_traer_filtros"
                                parametros={{ renglon: 'RENGLON_SEGUIMIENTOS' }}
                                name="renglon"
                                onValueChange={(valor) => setData('renglon', valor)}
                                error={errors.renglon}
                            />

                                <InputWithSearch
                                    label="Beneficiario"
                                    id="id_beneficiario"
                                    value={data.id_beneficiario}
                                    displayValue={data.nombre_beneficiario ?? ''}
                                    table="clientes"
                                    field="cliente"
                                    onChange={(value, item) => {
                                        setData('id_beneficiario', value);
                                        if (item) {
                                            setData('nombre_beneficiario', item.nombre);
                                            // ... otros campos que necesites actualizar
                                        }
                                    }}
                                    error={errors.id_beneficiario}
                                    className="mb-4"
                                />


                            <InputLabel
                                label="Fecha"
                                id="fecha"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                error={errors.fecha}
                                icon={<Calendar className="absolute top-2 right-2 h-4 w-4 text-gray-500" />}
                            />

                            <InputLabel
                                label="Referencia"
                                id="referencia"
                                value={data.referencia}
                                onChange={(e) => setData('referencia', e.target.value)}
                                error={errors.referencia}
                            />

                            {/* Segunda fila */}
                            <InputLabel
                                label="Código de barras"
                                id="codigoBarras"
                                value={data.codigoBarras}
                                onChange={(e) => setData('codigoBarras', e.target.value)}
                                error={errors.codigoBarras}
                            />

                            <InputLabel
                                label="Sucursal"
                                id="sucursal"
                                value={data.sucursal}
                                onChange={(e) => setData('sucursal', e.target.value)}
                                error={errors.sucursal}
                            />

                            <div className="flex w-full items-center">
                                <InputLabel
                                    label="Grupo"
                                    id="grupo"
                                    value={data.grupo}
                                    onChange={(e) => setData('grupo', e.target.value)}
                                    error={errors.grupo}
                                    className="w-full rounded-r-none"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6 h-9 w-9 shrink-0 rounded-l-none bg-green-600 text-white"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex w-full items-center">
                                <InputLabel
                                    label="Ubicación"
                                    id="ubicacion"
                                    value={data.ubicacion}
                                    onChange={(e) => setData('ubicacion', e.target.value)}
                                    error={errors.ubicacion}
                                    className="w-full rounded-r-none"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6 h-9 w-9 shrink-0 rounded-l-none bg-green-600 text-white"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <InputLabel
                                label="Detalle Ubicación"
                                id="detalleUbicacion"
                                value={data.detalleUbicacion}
                                onChange={(e) => setData('detalleUbicacion', e.target.value)}
                                error={errors.detalleUbicacion}
                            />

                            <InputLabel
                                label="Depreciación"
                                id="depreciacion"
                                value={data.depreciacion}
                                onChange={(e) => setData('depreciacion', e.target.value)}
                                error={errors.depreciacion}
                            />

                            <InputLabel
                                label="Categoría"
                                id="categoria"
                                value={data.categoria}
                                onChange={(e) => setData('categoria', e.target.value)}
                                error={errors.categoria}
                            />

                            {/* Cuarta fila */}
                            <InputLabel
                                label="Serie"
                                id="serie"
                                value={data.serie}
                                onChange={(e) => setData('serie', e.target.value)}
                                error={errors.serie}
                            />

                            <InputLabel
                                label="Meses"
                                id="meses"
                                value={data.meses}
                                onChange={(e) => setData('meses', e.target.value)}
                                error={errors.meses}
                            />

                            <InputLabel label="Foto" id="foto" type="file" onChange={(e) => setData('foto', e.target.value)} error={errors.foto} />

                            {/* Quinta fila */}
                            <div className="col-span-4">
                                <InputLabel
                                    label="Detalle"
                                    id="detalle"
                                    value={data.detalle}
                                    onChange={(e) => setData('detalle', e.target.value)}
                                    error={errors.detalle}
                                    multiline
                                />
                            </div>

                            {/* Línea naranja */}
                            <div className="col-span-4 h-2 rounded-md bg-orange-500"></div>

                            {/* Campo de búsqueda */}
                            <div className="col-span-4">
                                <div className="flex gap-2">
                                    <InputLabel
                                        label="Buscar"
                                        id="buscar"
                                        value={data.buscar}
                                        onChange={(e) => setData('buscar', e.target.value)}
                                        error={errors.buscar}
                                    />
                                    <Button type="button" className="h-9 bg-[#0066b3] hover:bg-[#005091]">
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </FormBody>
                </div>
            </div>
        </AppLayout>
    );
}
