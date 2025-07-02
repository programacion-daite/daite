import { FormDataTableSecion } from '@/components/form/form-data-table';
import { usePage } from '@inertiajs/react';

export default function Genericos() {
    const props = usePage().props;
    const tabla = props.tabla as string;
    const id_primario = props.id_primario as string;
    console.log(props);

    return <FormDataTableSecion tabla={tabla} id_primario={id_primario} props={props} />;
}
