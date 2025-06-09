// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Renglones() {
    return (
        <RegistroDinamico
            tabla="renglones"
            id_primario="id_renglon"
        />
    )
}
