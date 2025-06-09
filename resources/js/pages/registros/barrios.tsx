// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Barrios() {
    return (
        <RegistroDinamico
            tabla="barrios"
            id_primario="id_barrio"
        />
    )
}
