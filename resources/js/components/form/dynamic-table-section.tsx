import FormBody from '@/components/form/form-body';
import { FormHeader } from '@/components/form/form-header';
import { DynamicTable } from '@/components/table/dynamic-table';
import { TableItem } from '@/types/table';

interface DynamicTableSectionProps {
    table: string;
    title: string;
    primaryId: string;
    onNewClick: () => void;
    onEditClick: (item: TableItem) => void;
}

export default function DynamicTableSection({
    onEditClick,
    onNewClick,
    title,
    table,
    primaryId
}: DynamicTableSectionProps) {
    const titulo = `Registros de ${title}`;

    return (
        <div className="w-full">
            <FormHeader
                title={titulo}
                onSave={onNewClick}
                onBack={() => {}}
                backButtonProps={{
                    // className: 'hidden'
                }}
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
