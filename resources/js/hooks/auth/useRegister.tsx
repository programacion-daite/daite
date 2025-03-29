import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type SocioForm = {
    cedula: string;
    codigo: string;
};

// Hook to manage the registration form
export function useRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegister: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return { data, setData, handleRegister, processing, errors };
}

// Hook to check if a socio exists
export function useCheckSocio() {
    const { data, setData, post, processing, errors } = useForm<SocioForm>({
        cedula: '',
        codigo: '',
    });

    const [exists, setExists] = useState(false);

    const handleCheckSocio: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('check.socio'), {
            onSuccess: () => setExists(true),
            onError: () => setExists(false),
        });
    };

    return { data, setData, handleCheckSocio, processing, errors, exists };
}
