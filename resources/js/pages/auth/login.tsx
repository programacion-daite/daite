import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import AuthLayout from '@/layouts/auth-layout';
import { Link } from '@inertiajs/react';

type LoginForm = {
    nombre_usuario: string;
    contrasena: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        nombre_usuario: '',
        contrasena: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('contrasena'),
        });
    };

    return (
        <AuthLayout title="Inicio de Sesión">
            <Head title="Iniciar Sesión" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <InputLabel
                            label="Usuario"
                            id="nombre_usuario"
                            required
                            autoFocus
                            error={errors.nombre_usuario}
                            value={data.nombre_usuario}
                            onChange={(e) => setData('nombre_usuario', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <InputLabel
                            label="Contraseña"
                            id="contrasena"
                            required
                            error={errors.contrasena}
                            value={data.contrasena}
                            onChange={(e) => setData('contrasena', e.target.value)}
                        />
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-green-700 py-2 text-white hover:bg-green-800" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Iniciar sesión
                        </Button>
                    </div>

                    <div className="mt-4 flex justify-between gap-4">


                        <Link href={route('register')} className='w-full'>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-green-700 py-2 text-white hover:bg-green-800"
                            >
                                Registrarse
                            </Button>
                        </Link>

                        <Link href={route('password.request')} className='w-full'>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-green-700 py-2 text-white hover:bg-green-800"
                            >
                                Recuperar contraseña
                            </Button>
                        </Link>

                    </div>
                </div>

            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
