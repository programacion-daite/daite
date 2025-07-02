/* eslint-disable perfectionist/sort-imports */
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { PaginationSection } from './form-pagination-section';

type FormDataTableSectionProps = {
    tabla: string;
    id_primario: string;
    props: any;
};

export const FormDataTableSecion = ({ tabla, id_primario, props }: FormDataTableSectionProps) => {
    console.log('data', props);

    return (
        <>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px] text-center">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* {props.map((tb) => (
                        <TableRow key={tb}>
                            <TableCell className="font-medium">{tabla}</TableCell>
                            <TableCell>{tb}</TableCell>
                            <TableCell>{id_primario}</TableCell>
                            <TableCell className="text-right">{tb}</TableCell>
                            <TableCell className="text-center">
                            </TableCell>
                            </TableRow>
                            ))} */}
                    <button
                        onClick={() => {
                            console.log('Editar');
                        }}
                        className="hover:text-primary"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="mt-4">
                <PaginationSection />
            </div>
        </>
    );
};
