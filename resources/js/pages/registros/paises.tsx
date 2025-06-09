// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Paises() {
    return (
        <RegistroDinamico
            tabla="paises"
            id_primario="id_pais"
        />
    )
}
