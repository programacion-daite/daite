// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposCargos() {
    return (
        <RegistroDinamico
            tabla="tipos_cargos"
            id_primario="id_tipo_cargo"
        />
    )
}

