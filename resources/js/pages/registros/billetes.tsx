// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Billetes() {
    return (
        <RegistroDinamico
            tabla="billetes"
            id_primario="id_billete"
        />
    )
}
