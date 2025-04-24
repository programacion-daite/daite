// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Provincias() {
    return (
        <RegistroDinamico
            tabla="distritos"
            id_primario="id_distrito"
        />
    )
}
