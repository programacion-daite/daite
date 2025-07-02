import { Head } from '@inertiajs/react';

import FormBody from '@/components/form/form-body';
import { FormHeader } from '@/components/form/form-header';

export default function Beneficiaries() {
    return (
        <>
            <Head title="Beneficiarios" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full">
                    <FormHeader
                        title="Registro de Beneficiarios"
                        onSave={() => {}}
                        onClear={() => {}}
                        formId="beneficiarios-form"
                        onBack={() => {}}
                    />

                    <FormBody onSubmit={() => {}}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4"></div>
                    </FormBody>
                </div>
            </div>
        </>
    );
}
