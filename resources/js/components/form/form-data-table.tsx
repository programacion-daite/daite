/* eslint-disable perfectionist/sort-imports */
import { PaginationSection } from '@/components/form/form-pagination-section';
import { InputLabel } from '@/components/ui/input-label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { useDynamicFormModal } from '@/hooks/form/use-dynamic-form-modal';

export const FormDataTable = () => {
    return (
        <>
            <Suspense fallback={<div className="flex items-center justify-center p-4">Cargando...</div>}>
                <FormDataTableSection />
            </Suspense>
        </>
    );
};

type Field = { campo: string; visible: string; titulo: string; data: string[]; telefono: number };

const itemsPerPage = 300;

const FormDataTableSection = () => {
    const { data, fields, primaryId } = usePage().props;
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedData, setDisplayedData] = useState<Record<string, number>[]>([]);

    const typedFields = fields as Field[];
    const typedData = data as Record<string, number>[];

    const idField = typedFields.find((f) => f.campo === primaryId);

    const visibleFields = typedFields.filter((f) => f.visible === '1' && f.campo !== primaryId);

    const allFields = idField ? [idField, ...visibleFields] : visibleFields;

    const filteredData = useMemo(() => {
        return typedData
            .filter((row) => row[primaryId as string] > 0)
            .filter((row) =>
                filterText ? Object.values(row).some((value) => String(value).toLowerCase().includes(filterText.toLowerCase())) : true,
            );
    }, [typedData, primaryId, filterText]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            const newPageData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
            setDisplayedData(newPageData);
        },
        [filteredData],
    );

    useEffect(() => {
        handlePageChange(1);
    }, [handlePageChange]);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
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
                    <Table className="w-full overflow-hidden rounded-lg border border-gray-300 text-xs">
                        <TableHeader>
                            <TableRow className="rounded-t- bg-blue-600 hover:bg-blue-700">
                                {allFields.map((field) => (
                                    <TableHead key={field.campo} className="border-blue-500/30 px-1 py-1 font-extrabold text-white last:border-r-0">
                                        {field.titulo}
                                    </TableHead>
                                ))}
                                <TableHead className="px-1 py-1 font-medium text-white"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="rounded-bl-lg">
                            {displayedData.map((row, index) => (
                                <TableRow
                                    key={row[primaryId as string] || index}
                                    className={`right-5 transition-all duration-150 hover:bg-blue-900 hover:text-white ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-blue-100 text-black'
                                    }`}
                                    onDoubleClick={() => handleOpenEditForm(row)}
                                >
                                    {allFields.map((field) => (
                                        <TableCell key={field.campo} className="p-20 px-0 py-0">
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
                        <PaginationSection currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </div>
    );
};
