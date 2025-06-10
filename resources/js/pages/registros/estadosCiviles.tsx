// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function EstadosCiviles() {
    return (
        <RegistroDinamico
            tabla="estados_civiles"
            id_primario="id_estado_civil"
        />
    )
}
