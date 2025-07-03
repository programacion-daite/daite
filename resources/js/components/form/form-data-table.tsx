/* eslint-disable perfectionist/sort-imports */
import { PaginationSection } from '@/components/form/form-pagination-section';
import { Card } from '@/components/ui/card';
import { InputLabel } from '@/components/ui/input-label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';
type Field = { campo: string; visible: string; titulo: string; data: string[] };

export const FormDataTableSection = () => {
    const { data, fields, primaryId, table } = usePage().props;
    const [filterText, setFilterText] = useState('');

    console.log('DATA', fields, data, primaryId, table);

    const typedFields = fields as Field[];
    const typedData = data as Record<string, number>[];

    const idField = typedFields.find((f) => f.campo === primaryId);

    const visibleFields = typedFields.filter((f) => f.visible === '1' && f.campo !== primaryId);

    const allFields = idField ? [idField, ...visibleFields] : visibleFields;
    const filteredData = typedData.filter((row) => row[primaryId as string] > 0);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    }, []);

    return (
        <div className="mx-auto w-full space-y-6 p-6">
            <div className="flex items-center space-x-2 p-2">
                <InputLabel label="Buscar" id="buscar" name="buscar" value={filterText} onChange={handleFilterChange} />
            </div>
            <Card className="overflow-hidden border-0 shadow-lg">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                {allFields.map((field) => (
                                    <TableHead
                                        key={field.campo}
                                        className="border-r border-blue-500/30 px-6 py-4 text-sm font-semibold tracking-wide text-white last:border-r-0"
                                    >
                                        {field.titulo || field.campo}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.slice(0, 10).map((row, index) => (
                                <TableRow
                                    key={row[primaryId as string] || index}
                                    className={`border-b border-gray-100 transition-all duration-200 hover:bg-blue-50/50 hover:shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} `}
                                >
                                    {allFields.map((field) => (
                                        <TableCell key={field.campo} className="py-4">
                                            {row[field.campo]}
                                        </TableCell>
                                    ))}
                                    <TableCell className="px-6 py-4 text-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                            onClick={() => console.log(`Editar ${row[index as number]}`)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="m-2 text-sm">
                        <PaginationSection />
                    </div>
                </div>
            </Card>
        </div>
    );
};
