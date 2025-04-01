import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputLabel } from '@/components/ui/input-label';
import { Label } from '@/components/ui/label';
import MaskedInput from '@/components/ui/masked-input';
import { useCheckSocio, useRegister } from '@/hooks/auth/useRegister';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Register() {
    const { data: checkData, setData: setCheckData, handleCheckSocio, processing: checking, errors: checkErrors, exists } = useCheckSocio();
    const { data, setData, handleRegister, processing, errors } = useRegister();

    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log(checkData);
        if (checkData.cedula.length === 13) {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(() => {
                axios
                    .get(route('checkSocio', [checkData.cedula]))
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }, 500);
        }

        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [checkData.cedula]); // Solo se ejecuta cuando cambie cedula

    return (
        <AuthLayout title="Verificar Socio" description="Ingrese su cédula para continuar con el registro">
            <Head title="Registro" />

            {/* Formulario para verificar si el socio existe */}
            {!exists && (
                <form className="flex flex-col gap-6" onSubmit={handleCheckSocio}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <MaskedInput
                                label="Cédula"
                                id="cedula"
                                maskType="cedula"
                                type="text"
                                required
                                autoFocus
                                value={checkData.cedula}
                                error={checkErrors.cedula}
                                onInput={(e) => setCheckData('cedula', e.target.value)}
                                disabled={checking}
                            />

                            <InputLabel
                                label="Codigo"
                                id="codigo"
                                type="text"
                                required
                                value={checkData.codigo}
                                error={checkErrors.codigo}
                                onChange={(e) => {
                                    console.log('Código cambiado:', e.target.value);
                                    // Actualiza solo el valor del código
                                    setCheckData((prev) => ({
                                        ...prev,
                                        codigo: e.target.value,
                                    }));
                                }}
                                readOnly={true}
                            />
                        </div>

                        <Button type="submit" className="mt-2 w-full" disabled={checking}>
                            {checking && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Verificar
                        </Button>
                    </div>
                </form>
            )}

            {/* Formulario de registro (se muestra solo si exists es true) */}
            {exists && (
                <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <InputLabel
                                label="Nombre"
                                id="name"
                                type="text"
                                required
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre completo"
                                error={errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Contraseña"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirmar contraseña"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear cuenta
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        ¿Ya tienes una cuenta? <TextLink href={route('login')}>Iniciar sesión</TextLink>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
