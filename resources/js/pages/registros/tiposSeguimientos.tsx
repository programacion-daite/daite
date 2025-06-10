// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposSeguimientos() {
    return (
        <RegistroDinamico
            tabla="tipos_seguimientos"
            id_primario="id_seguimiento"
        />
    )
}
