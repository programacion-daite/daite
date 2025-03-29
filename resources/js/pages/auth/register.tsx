import { Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { InputLabel } from '@/components/ui/input-label';
import { useRegister, useCheckSocio } from '@/hooks/auth/useRegister';
import type { MaskitoOptions } from '@maskito/core';
import {useMaskito} from '@maskito/react';
import axios from 'axios';

const cedulaMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/],
}

export default function Register() {

    const { data: checkData, setData: setCheckData, handleCheckSocio, processing: checking, errors: checkErrors, exists } = useCheckSocio();
    const { data, setData, handleRegister, processing, errors } = useRegister();

    const cedulaRef = useMaskito({options: cedulaMask})

    const [typing, setTyping] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (checkData.cedula.length === 13) { // Asegurar que el formato está completo
            if (debounceTimeout) clearTimeout(debounceTimeout); // Limpiar timeout anterior

            const timeout = setTimeout(() => {
                 axios.post('/check-socio', checkData.cedula).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.error(error);
                });
            }, 500); 

            setDebounceTimeout(timeout);
        }
    }, [checkData.cedula, debounceTimeout]); // Se ejecuta cada vez que la cédula cambia

    return (
        <AuthLayout title="Verificar Socio" description="Ingrese su cédula para continuar con el registro">
            <Head title="Registro" />

            {/* Formulario para verificar si el socio existe */}
            {!exists && (
                <form className="flex flex-col gap-6" onSubmit={handleCheckSocio}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <InputLabel
                                label="Cédula"
                                id="cedula"
                                type="text"
                                required
                                autoFocus
                                value={checkData.cedula}
                                error={checkErrors.cedula}
                                onChange={(e) => setCheckData('cedula', e.target.value)}
                                disabled={checking}
                                // onBlur={() => setTyping(false)} 
                                ref={cedulaRef}
                            />

                            <InputLabel
                                label="Codigo"
                                id="codigo"
                                type="text"
                                required
                                autoFocus
                                value={checkData.codigo}
                                error={checkErrors.codigo}
                                onChange={(e) => setCheckData('codigo', e.target.value)}
                                disabled={checking}
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
                        ¿Ya tienes una cuenta?{' '}
                        <TextLink href={route('login')}>
                            Iniciar sesión
                        </TextLink>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
