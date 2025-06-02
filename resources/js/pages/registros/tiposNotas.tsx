// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposNotas() {
    return (
        <RegistroDinamico
            tabla="tipos_notas"
            id_primario="id_tipo_nota"
        />
    )
}
