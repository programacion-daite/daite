/* eslint-disable perfectionist/sort-imports */
import { PaginationSection } from '@/components/form/form-pagination-section';
import { InputLabel } from '@/components/ui/input-label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useDynamicFormModal } from '@/hooks/form/use-dynamic-form-modal';

type Field = { campo: string; visible: string; titulo: string; data: string[]; telefono: number };

export const FormDataTableSection = () => {
    const { data, fields, primaryId } = usePage().props;
    const [filterText, setFilterText] = useState('');

    const typedFields = fields as Field[];
    const typedData = data as Record<string, number>[];

    const idField = typedFields.find((f) => f.campo === primaryId);

    const phoneFilds = typedFields.find((f) => f.campo === 'telefono');

    console.log(phoneFilds);

    const visibleFields = typedFields.filter((f) => f.visible === '1' && f.campo !== primaryId);

    const allFields = idField ? [idField, ...visibleFields] : visibleFields;
    const filteredData = typedData.filter((row) => row[primaryId as string] > 0);
    // console.log('DATA', allFields, filteredData);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    }, []);

    const { handleOpenEditForm } = useDynamicFormModal();

    return (
        <div className="max-w-8xl mx-auto w-full space-y-4 p-3 text-sm">
            <div className="flex items-center space-x-2 p-1">
                <InputLabel label="Buscar" id="buscar" name="buscar" value={filterText} onChange={handleFilterChange} />
            </div>

            <div className="mx-auto w-full overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="w-full overflow-hidden rounded-xl border border-gray-300 text-xs">
                        <TableHeader>
                            <TableRow className="rounded-t-xl bg-blue-600 hover:bg-blue-700">
                                {allFields.map((field) => (
                                    <TableHead key={field.campo} className="border-blue-500/30 px-2 py-2 font-medium text-white last:border-r-0">
                                        {field.titulo}
                                    </TableHead>
                                ))}
                                <TableHead className="px-2 py-2 font-medium text-white"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="rounded-b-xl">
                            {filteredData.slice(0, 10).map((row, index) => (
                                <TableRow
                                    key={row[primaryId as string] || index}
                                    className={`transition-all duration-150 hover:bg-blue-900 hover:text-white ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-blue-100 text-black'
                                    }`}
                                    onDoubleClick={() => handleOpenEditForm(row)}
                                >
                                    {allFields.map((field) => (
                                        <TableCell key={field.campo} className="px-0 py-0">
                                            {row[field.campo]}
                                        </TableCell>
                                    ))}
                                    <TableCell className="px-1 py-1 text-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                            onClick={() => handleOpenEditForm(row)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="m-2 text-xs">
                        <PaginationSection />
                    </div>
                </div>
            </div>
        </div>
    );
};
