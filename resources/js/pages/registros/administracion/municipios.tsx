// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Municipios() {
    return (
        <RegistroDinamico
            tabla="municipios"
            id_primario="id_municipio"
        />
    )
}
