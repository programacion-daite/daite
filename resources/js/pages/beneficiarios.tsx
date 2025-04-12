import FormBody from '@/components/form/form-body';
import FormHeader from '@/components/form/form-header';
import { DynamicSelect } from '@/components/dynamic-select';
import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import { useBeneficiarios } from '@/hooks/register/use-beneficiarios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { InputWithSearch } from '@/components/input-with-search';
import { BeneficiarioItem } from '@/types/entities';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beneficiarios',
        href: '/beneficiarios',
    },
];

export default function Beneficiaries() {
    const { data, setData, errors } = useBeneficiarios();

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

                            <InputWithSearch<BeneficiarioItem>
                                label="Beneficiario"
                                id="id_cliente"
                                value={data.id_cliente}
                                displayValue={data.cliente ?? ''}
                                field="cliente"
                                table="clientes"
                                onChange={(value, item) => {
                                    setData('id_cliente', value);
                                    if (item) {
                                        setData('cliente', item.beneficiario);
                                    }
                                }}
                                error={errors.id_beneficiario}
                                className="mb-4 col-span-1"
                            />

                            {/* <InputLabel
                                label="Fecha"
                                id="fecha"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                error={errors.fecha}
                                icon={<Calendar className="absolute top-2 right-2 h-4 w-4 text-gray-500" />}
                            /> */}

                            <InputLabel
                                label="Referencia"
                                id="referencia"
                                value={data.referencia}
                                onChange={(e) => setData('referencia', e.target.value)}
                                error={errors.referencia}
                            />

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

                            <div className="col-span-4">
                                <div className="space-y-2">
                                    <label htmlFor="detalle" className="text-sm font-medium">Detalle</label>
                                    <textarea
                                        id="detalle"
                                        value={data.detalle}
                                        onChange={(e) => setData('detalle', e.target.value)}
                                        className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    />
                                    {errors.detalle && <p className="text-sm text-red-500">{errors.detalle}</p>}
                                </div>
                            </div>



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
