// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposContactos() {
    return (
        <RegistroDinamico
            tabla="tipos_contactos"
            id_primario="id_tipo_contacto"
        />
    )
}
