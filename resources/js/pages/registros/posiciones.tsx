// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Posiciones() {
    return (
        <RegistroDinamico
            tabla="posiciones"
            id_primario="id_posicion"
        />
    )
}
