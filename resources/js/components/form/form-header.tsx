import { ArrowLeft } from "lucide-react";

import { Button } from '@/components/ui/button';

type FormHeaderProps = {
    title: string;
    onSave: () => void;
    onClear: () => void;
    formId: string;
};

export default function FormHeader({ title, onSave, onClear, formId }: FormHeaderProps) {

    const onBack = () => {
        window.history.back();
    }

    return (
        <div className="bg-[#e6f0f9] p-4 rounded-t-md flex justify-between items-center w-full">
            <Button variant="ghost" size="icon" className="bg-blue-600 text-white h-8 w-8" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-[#0066b3]">{ title }</h2>
            <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 h-8" onClick={onSave} type="submit" form={formId}>Guardar</Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-8" onClick={onClear}>Limpiar</Button>
            </div>
        </div>
    )
}