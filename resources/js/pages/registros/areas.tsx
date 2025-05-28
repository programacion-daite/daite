// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Areas() {
    return (
        <RegistroDinamico
            tabla="areas"
            id_primario="id_area"
        />
    )
}
