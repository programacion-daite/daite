// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Generos() {
    return (
        <RegistroDinamico
            table="generos"
            primaryId="id_genero"
        />
    )
}
