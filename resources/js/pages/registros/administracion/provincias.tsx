// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function Provincias() {
    return (
        <RegistroDinamico
            table="provincias"
            primaryId="id_provincia"
        />
    )
}
