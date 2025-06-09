// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposTasas() {
    return (
        <RegistroDinamico
            tabla="tipoa_tasas"
            id_primario="id_tipo_tasa"
        />
    )
}
