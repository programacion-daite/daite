import { AsyncSearchSelect } from '@/components/async-select';
import { DatePicker } from '@/components/date-picker';
import { DynamicSelect } from '@/components/dynamic-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputLabel } from '@/components/ui/input-label';
import MaskedInput from '@/components/ui/masked-input';
import { useDynamicFormStore } from '@/store/useDynamicFormStore';
import { DatabaseField, FormDataType } from '@/types/form';
import { useForm } from '@inertiajs/react';
import { CheckCircle, Loader2, PlusCircle, Save, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { FormField } from './form-field';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    title: string;
    initialData: FormDataType;
    onSubmit: (data: FormDataType) => Promise<void>;
    fields: DatabaseField[];
    disableClose?: boolean;
    isLoading?: boolean;
}

const componentMap = {
    InputLabel,
    DynamicSelect,
    DatePicker,
    AsyncSearchSelect,
    MaskedInput,
};

export function ModalForm({ isOpen, onClose, mode, title, initialData, onSubmit, fields, disableClose = false, isLoading = false }: ModalFormProps) {
    const { data, setData, processing, errors, reset } = useForm<FormDataType>(initialData);
    const { setErrors, showError } = useDynamicFormStore();

    useEffect(() => {
        if (isOpen) {
            reset();
            setData(initialData);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await onSubmit(data);
        } catch (error) {
            showError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData(e.target.name, e.target.value);
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setData(e.currentTarget.name, e.currentTarget.value);
    };

    const handleComponentChange = (name: string) => (value: string) => {
        setData(name, value);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent
                className="max-w-md md:max-w-lg rounded-lg overflow-hidden p-0 gap-0 [&>button:last-child]:hidden"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                    <DialogTitle className="text-xl font-medium flex items-center gap-2 capitalize">
                        {mode === 'create' ? (
                            <>
                                <PlusCircle className="h-5 w-5" /> Creación de {title}
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" /> Modificación de {title}
                            </>
                        )}
                    </DialogTitle>
                    {!disableClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 cursor-pointer hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-3 pb-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        </div>
                    ) : (
                        fields.map((field) => {
                            const Component = componentMap[field.componente || 'InputLabel'];
                            const isMaskedInput = field.componente === 'MaskedInput';

                            return (
                                <FormField
                                    key={field.nombre}
                                    component={Component}
                                    id={field.nombre}
                                    label={field.label}
                                    name={field.nombre}
                                    parametros={field.parametros}
                                    data={data}
                                    errors={errors}
                                    onChange={!isMaskedInput ? handleInputChange : undefined}
                                    onInput={isMaskedInput ? handleInput : undefined}
                                    onValueChange={handleComponentChange(field.nombre)}
                                    className={field.classname}
                                />
                            );
                        })
                    )}
                </form>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 p-3">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || processing}
                        className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white transition-colors hover:from-emerald-600 hover:to-green-700"
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : mode === 'create' ? (
                            <>
                                <PlusCircle className="h-4 w-4" /> Crear
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" /> Guardar
                            </>
                        )}
                    </Button>

                    <Button type="button" variant="destructive" onClick={onClose} disabled={processing || isLoading} className="cursor-pointer">
                        Cancelar
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
