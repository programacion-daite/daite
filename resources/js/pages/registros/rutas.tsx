// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Rutas() {
    return (
        <RegistroDinamico
            tabla="rutas"
            id_primario="id_ruta"
        />
    )
}
