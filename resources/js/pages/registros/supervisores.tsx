// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Supervisores() {
    return (
        <RegistroDinamico
            tabla="supervisores"
            id_primario="id_supervisor"
        />
    )
}
