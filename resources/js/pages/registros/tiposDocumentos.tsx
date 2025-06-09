// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function TiposDocumentos() {
    return (
        <RegistroDinamico
            tabla="tipos_documentos"
            id_primario="id_tipo_documento"
        />
    )
}
