// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Municipios() {
    return (
        <RegistroDinamico
            table="municipios"
            primaryId="id_municipio"
        />
    )
}
