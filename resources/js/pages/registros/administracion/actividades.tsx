// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Actividades() {
    return (
        <RegistroDinamico
            tabla="actividades"
            id_primario="id_actividad"
        />
    )
}
