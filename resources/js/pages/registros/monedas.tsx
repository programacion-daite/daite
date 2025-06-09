// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Monedas() {
    return (
        <RegistroDinamico
            tabla="monedas"
            id_primario="id_moneda"
        />
    )
}
