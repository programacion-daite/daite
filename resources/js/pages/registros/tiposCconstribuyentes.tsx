// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function tiposConstribuyentes() {
    return (
        <RegistroDinamico
            tabla="tipos_constribuyentes"
            id_primario="id_tipo_constribuyente"
        />
    )
}
