// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Cajeros() {
    return (
        <RegistroDinamico
            tabla="cajeros"
            id_primario="id_cajero"
        />
    )
}
