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
    const { data, setData, post, processing, errors, reset } = useForm<Required<BeneficiariosForm>>({
        id_beneficiario: '',
        renglon: '',
        id_cuenta: 'true',
        id_banco: '',
        id_tipo_cuenta: '',
        id_moneda: '',
        numero_cuenta: '',
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

    return { data, setData, post, processing, errors, reset, handleChange };
}
