// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function clasificacionesContables() {
    return (
        <RegistroDinamico
            tabla="clasificaciones_contables"
            id_primario="id_clasificacion_contable"
        />
    )
}
