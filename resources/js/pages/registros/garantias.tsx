// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Garantias() {
    return (
        <RegistroDinamico
            tabla="garantias"
            id_primario="id_garantia"
        />
    )
}

