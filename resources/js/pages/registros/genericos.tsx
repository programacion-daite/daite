import RegistroDinamico from "@/components/form/dynamic-form"
import { usePage } from "@inertiajs/react"

export default function Genericos() {
    const props = usePage().props;
    const tabla = (props.tabla as string);
    const id_primario = (props.id_primario as string);

    return (
        <RegistroDinamico
            tabla={tabla}
            id_primario={id_primario}
        />
    )
}
