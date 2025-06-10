// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Especialidades() {
    return (
        <RegistroDinamico
            tabla="especialidades"
            id_primario="id_especialidad"
        />
    )
}
