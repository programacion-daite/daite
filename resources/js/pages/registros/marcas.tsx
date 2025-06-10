// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Marcas() {
    return (
        <RegistroDinamico
            tabla="marcas"
            id_primario="id_marca"
        />
    )
}
