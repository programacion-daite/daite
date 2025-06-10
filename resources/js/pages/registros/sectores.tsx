// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Sectores() {
    return (
        <RegistroDinamico
            tabla="sectores"
            id_primario="id_sector"
        />
    )
}
