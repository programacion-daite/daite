// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Sucursales() {
    return (
        <RegistroDinamico
            tabla="sucursales"
            id_primario="id_sucursal"
        />
    )
}
