// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Actividades() {
    return (
        <RegistroDinamico
            table="actividades"
            primaryId="id_actividad"
        />
    )
}
