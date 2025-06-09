// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function tiposRelaciones() {
    return (
        <RegistroDinamico
            tabla="tipos_relaciones"
            id_primario="id_tipo_relacion"
        />
    )
}
