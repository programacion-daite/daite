// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Argumentos() {
    return (
        <RegistroDinamico
            tabla="argumentos"
            id_primario="id_argumento"
        />
    )
}