// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Bancos() {
    return (
        <RegistroDinamico
            tabla="bancos"
            id_primario="id_banco"
        />
    )
}
