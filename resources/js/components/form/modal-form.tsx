import { AsyncSearchSelect } from '@/components/async-select';
import DatePicker  from '@/components/date-picker';
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

const componentMap = {
    InputLabel,
    DynamicSelect,
    DatePicker,
    AsyncSearchSelect,
    MaskedInput,
};

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

export function ModalForm({ isOpen, onClose, mode, title, initialData, onSubmit, fields, disableClose = false, isLoading = false }: ModalFormProps) {
    const { data, setData, processing, errors, reset } = useForm<FormDataType>(initialData);
    const { setErrors, showError } = useDynamicFormStore();

    useEffect(() => {
        if (isOpen) {
            reset();
            setData(initialData);
            const timer = setTimeout(() => {
                const modalContent = document.querySelector('[role="dialog"]');
                const firstInput = modalContent?.querySelector('input:not([type="hidden"]):not(.hidden), select:not(.hidden), textarea:not(.hidden)');
                if (firstInput instanceof HTMLElement) {
                    firstInput.focus();
                    if (firstInput instanceof HTMLInputElement) {
                        firstInput.select();
                    }
                }
            }, 100);

            return () => clearTimeout(timer);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value.replace(/,/g, '').toUpperCase();
        setData(e.target.name, value);
    };

    const handleComponentChange = (name: string) => (value: string) => {
        setData(name, value.toUpperCase());
    };

    title = title.replace('_', ' ');

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent
                className="max-w-md md:max-w-lg rounded-lg overflow-hidden p-0 gap-0 [&>button:last-child]:hidden"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
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

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4 px-3 pb-2"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        </div>
                    ) : (
                        fields.map((field, index) => {
                            const Component = componentMap[field.componente || 'InputLabel'];

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
                                    onChange={handleChange}
                                    onValueChange={handleComponentChange(field.nombre)}
                                    className={field.classname}
                                    tabIndex={index + 1}
                                />
                            );
                        })
                    )}
                </form>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 p-3">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading || processing}
                        className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white transition-colors hover:from-emerald-600 hover:to-green-700"
                        tabIndex={fields.length + 1}
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : mode === 'create' ? (
                            <>
                                <PlusCircle className="h-4 w-4" /> Guardar
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" /> Guardar
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onClose}
                        disabled={processing || isLoading}
                        className="cursor-pointer"
                        tabIndex={fields.length + 2}
                    >
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
