import { Button } from '@/components/ui/button';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { DynamicSelect } from '@/components/dynamic-select';
import { useState } from 'react';
import BarChartGraphic from '@/components/barchartgraphic';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleEntity, fetchDatos } from '@/lib/api';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Estadisticas',
        href: '/estadisticas',
    },
];

export default function Estadisticas() {
    const { modules } = usePage().props as unknown as { modules: { valor: string; descripcion: string }[] };
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedInforme, setSelectedInforme] = useState<string>('');

    // Query para detalles del informe
    const { data: detalles, isLoading: loadingDetalles } = useQuery({
      queryKey: ['detalles', selectedInforme],
      queryFn: () => fetchSingleEntity(selectedInforme),
      enabled: !!selectedInforme,
      select: (data) => data[0],
    });

    // Query para datos del informe
    const { data: datos, isLoading: loadingDatos } = useQuery({
      queryKey: ['datos', selectedInforme],
      queryFn: () => fetchDatos(selectedInforme),
      enabled: !!selectedInforme && !!detalles,
    });

    // Prepara los datos para el gráfico
    const chartData = (datos || []).map((item: { x: string; y: string | number }) => ({
      x: item.x?.trim() ?? '',
      y: Number(item.y),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estadisticas" />

            <div className="bg-[#e6f0f9] p-4 rounded-t-md flex items-center w-full">
                <Button variant="ghost" size="icon" className="bg-blue-600 text-white h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-[#0066b3] flex-grow text-center">Estadisticas</h2>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <DynamicSelect
                        id="id_modulo"
                        name="module"
                        label="Módulo"
                        parametros={{
                            options: modules.map(module => ({
                                value: module.valor,
                                label: module.descripcion
                            }))
                        }}
                        onValueChange={(value) => setSelectedModule(value)}
                        value={selectedModule}
                        placeholder="Selecciona una opción"
                    />

                    <DynamicSelect
                        id="id_tipo_informe"
                        name="type"
                        label="Tipo de informe"
                        isDependent={true}
                        dependentOn={{
                            selectId: "id_modulo",
                            valueKey: "value"
                        }}
                        procedure={{
                            name: "p_traer_filtros",
                            params: {
                                valor: (value) => value,
                                renglon: "informes",
                                tipo_filtro: "modulo"
                            }
                        }}
                        onValueChange={(value) => {
                            setSelectedInforme(value);
                            console.log(value);
                        }}
                        value=""
                        placeholder="Selecciona una opción"
                        disabled={!selectedModule}
                    />
                </div>
            </div>


            <div className="p-4">
                {loadingDetalles || loadingDatos ? (
                <div>Cargando gráfico...</div>
                ) : detalles && detalles.tipo === 'BARRA' && chartData.length > 0 ? (
                <BarChartGraphic data={chartData} title={detalles.informe} />
                ) : (
                <div style={{ textAlign: 'center', color: '#aaa' }}>Selecciona un informe para ver el gráfico</div>
                )}
            </div>

        </AppLayout>
    );
}
