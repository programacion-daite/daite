// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Oficiales() {
    return (
        <RegistroDinamico
            tabla="oficiales"
            id_primario="id_oficial"
        />
    )
}
