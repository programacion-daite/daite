// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Categorias() {
    return (
        <RegistroDinamico
            tabla="categorias"
            id_primario="id_categoria"
        />
    )
}
