// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function tiposVehiculos() {
    return (
        <RegistroDinamico
            tabla="tipos_vehiculos"
            id_primario="id_tipo_vehiculos"
        />
    )
}
