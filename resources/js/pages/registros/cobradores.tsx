// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Cobradores() {
    return (
        <RegistroDinamico
            tabla="cobradores"
            id_primario="id_cobrador"
        />
    )
}
