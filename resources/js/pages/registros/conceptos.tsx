// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Conceptos() {
    return (
        <RegistroDinamico
            tabla="conceptos"
            id_primario="id_concepto"
        />
    )
}
