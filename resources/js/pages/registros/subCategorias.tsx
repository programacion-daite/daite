// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function SubCategorias() {
    return (
        <RegistroDinamico
            tabla="subcategorias"
            id_primario="id_subcategoria"
        />
    )
}
