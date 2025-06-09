// import RegistroDinamico from "./layout"
import RegistroDinamico from "@/components/form/dynamic-form"

export default function FormasPagos() {
    return (
        <RegistroDinamico
            tabla="formas_pagos"
            id_primario="forma_pago"
        />
    )
}
