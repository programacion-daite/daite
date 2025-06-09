// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposCalculos() {
    return (
        <RegistroDinamico
            tabla="tipos_calculos"
            id_primario="id_tipo_calculo"
        />
    )
}
