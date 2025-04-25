import { FormHeader } from '@/components/form/form-header';
import FormBody from '@/components/form/form-body';
import { DynamicTable } from '@/components/table/dynamic-table';
import { TableItem } from '@/types/table';
import { capitalize } from '@/lib/utils';

interface DynamicTableSectionProps {
    tabla: string;
    id_primario: string;
    onNewClick: () => void;
    onEditClick: (item: TableItem) => void;
}

export function DynamicTableSection({
    tabla,
    id_primario,
    onNewClick,
    onEditClick
}: DynamicTableSectionProps) {
    const titulo = `Registros de ${capitalize(tabla.replace(/_/g, ' '))}`;

    return (
        <div className="w-full">
            <FormHeader
                title={titulo}
                onSave={onNewClick}
                onClear={() => {}}
                onBack={() => window.history.back()}
                formId={`${tabla}Form`}
                saveButtonProps={{ children: 'Crear' }}
            />
            <FormBody
                onSubmit={(e) => {
                    e.preventDefault();
                    onNewClick();
                }}
            >
                <div className="space-x-3">
                    <div className="w-full">
                        <DynamicTable
                            tabla={tabla}
                            id_primario={id_primario}
                            onRowClick={onEditClick}
                            onDoubleClick={onEditClick}
                        />
                    </div>
                </div>
            </FormBody>
        </div>
    );
}
