// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Grupos() {
    return (
        <RegistroDinamico
            tabla="grupos"
            id_primario="id_grupo"
        />
    )
}
