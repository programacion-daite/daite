// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Provincias() {
    return (
        <RegistroDinamico
            tabla="provincias"
            id_primario="id_provincia"
        />
    )
}
