// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Departamentos() {
    return (
        <RegistroDinamico
            tabla="departamentos"
            id_primario="id_departamento"
        />
    )
}
