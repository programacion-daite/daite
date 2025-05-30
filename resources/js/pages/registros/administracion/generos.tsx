// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Generos() {
    return (
        <RegistroDinamico
            tabla="generos"
            id_primario="id_genero"
        />
    )
}
