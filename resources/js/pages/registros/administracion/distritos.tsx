// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Provincias() {
    return (
        <RegistroDinamico
            table="distritos"
            primaryId="id_distrito"
        />
    )
}
