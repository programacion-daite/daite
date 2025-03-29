// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input-label';
import AuthLayout from '@/layouts/auth-layout';
import { Link } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ correo: string; cedula: string }>>({
        correo: '',
        cedula: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Rec. Contraseña">
            <Head title="Rec. Contraseña" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <InputLabel
                            label="Correo"
                            id="correo"
                            type="email"
                            autoComplete="off"
                            autoFocus
                            value={data.correo}
                            error={errors.correo}
                            onChange={(e) => setData('correo', e.target.value)}
                        />

                        <InputLabel
                            label="Cedula"
                            id="cedula"
                            type="text"
                            autoComplete="off"
                            autoFocus
                            value={data.cedula}
                            error={errors.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                        />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Enviar
                        </Button>
                    </div>
                </form>

                <div className="my-6 flex items-center justify-start">
                    <Link href={route('login')} className='w-full'>
                        <Button className="w-full bg-gray-500 text-white hover:bg-gray-600" disabled={processing}>
                            Regresar
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
