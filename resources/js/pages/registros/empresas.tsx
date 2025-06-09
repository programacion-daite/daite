// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Empresas() {
    return (
        <RegistroDinamico
            tabla="empresas"
            id_primario="id_empresa"
        />
    )
}
