// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposPermisos() {
    return (
        <RegistroDinamico
            tabla="tipos_permisos"
            id_primario="id_tipo_permiso"
        />
    )
}
