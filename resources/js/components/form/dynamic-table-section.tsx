import { FormHeader } from '@/components/form/form-header';
import FormBody from '@/components/form/form-body';
import { DynamicTable } from '@/components/table/dynamic-table';
import { TableItem } from '@/types/table';
import { capitalize } from '@/lib/utils';

interface DynamicTableSectionProps {
    table: string;
    primaryId: string;
    onNewClick: () => void;
    onEditClick: (item: TableItem) => void;
}

export default function DynamicTableSection({
    table,
    primaryId,
    onNewClick,
    onEditClick
}: DynamicTableSectionProps) {
    const titulo = `Registros de ${capitalize(table.replace(/_/g, ' '))}`;

    return (
        <div className="w-full">
            <FormHeader
                title={titulo}
                onSave={onNewClick}
                onBack={() => window.history.back()}
                formId={`${table}Form`}
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
                            table={table}
                            primaryId={primaryId}
                            onDoubleClick={onEditClick}
                        />
                    </div>
                </div>
            </FormBody>
        </div>
    );
}
