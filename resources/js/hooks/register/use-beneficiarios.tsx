import { useForm } from "@inertiajs/react";

type BeneficiariosForm = {
    id_beneficiario: string;
    renglon: string;
    id_cuenta: string;
    id_banco: string;
    id_tipo_cuenta: string;
    id_moneda: string;
    numero_cuenta: string;
    [key: string]: string;
}

export const useBeneficiarios = () => {
    const { data, errors, post, processing, reset, setData } = useForm<Required<BeneficiariosForm>>({
        id_banco: '',
        id_beneficiario: '',
        id_cuenta: '',
        id_moneda: '',
        id_tipo_cuenta: '',
        numero_cuenta: '',
        renglon: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, id?: string) => {
        if (typeof e === 'string') {
            // Handle select change
            setData(id as keyof BeneficiariosForm, e);
        } else {
            // Handle input change
            setData(e.target.name as keyof BeneficiariosForm, e.target.value);
        }
    };

    return { data, errors, handleChange, post, processing, reset, setData };
}
