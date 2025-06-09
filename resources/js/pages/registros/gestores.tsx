// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Gestores() {
    return (
        <RegistroDinamico
            tabla="gestores"
            id_primario="id_gestor"
        />
    )
}
