import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import logotipo from '@/../../public/img/logotipo.png';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputLabel } from '@/components/ui/input-label';

type LoginForm = {
    nombre_usuario: string;
    contrasena: string;
    remember: boolean;
};

export default function Login() {
    const { data, errors, post, processing, reset, setData } = useForm<Required<LoginForm>>({
        contrasena: '',
        nombre_usuario: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('contrasena'),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />
            <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
                <div className="mb-6 flex flex-col items-center justify-center">
                    <div className="relative mb-2 h-16 w-60">
                        <img src={logotipo} alt="DAITE Logo" className="object-contain" />
                    </div>
                    <h1 className="text-xl font-medium text-[#0a5ca8]">Inicio de sesión</h1>
                </div>

                <form className="space-y-6" autoComplete='off' onSubmit={submit}>
                    <div className="space-y-2">
                        <InputLabel
                            label="Nombre de Usuario"
                            id="usuario"
                            className="text-gray-700"
                            value={data.nombre_usuario}
                            onChange={(e) => setData('nombre_usuario', e.target.value)}
                            error={errors.nombre_usuario}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            type="password"
                            label="Contraseña"
                            id="contrasena"
                            className="text-gray-700"
                            value={data.contrasena}
                            onChange={(e) => setData('contrasena', e.target.value)}
                            error={errors.contrasena}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="mantener" />
                        <label
                            htmlFor="mantener"
                            className="text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Mantener sesión iniciada
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#0a5ca8] hover:bg-[#084a87]"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Iniciar sesión
                    </Button>
                </form>

                <div className="mt-8 flex flex-col text-center text-sm text-gray-600 md:flex-row md:justify-between">
                    <div>{new Date().getFullYear()} © Daite</div>
                    <div>
                        Desarrollado por{' '}
                        <a href="#" className="text-[#0a5ca8]">
                            Daite S.R.L.
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
