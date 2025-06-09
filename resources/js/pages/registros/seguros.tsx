// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Seguros() {
    return (
        <RegistroDinamico
            tabla="seguros"
            id_primario="id_seguro"
        />
    )
}
