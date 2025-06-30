import { AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type Error = {
    title: string
    message: string
}

interface ResultModalNewProps {
    open: boolean
    onClose: () => void
    title: string
    message: string
    errors: Error[]
    status: 'success' | 'error'
}

function ModalHeader({ status, title }: { title: string; status: 'success' | 'error' }) {
    const isSuccess = status === "success"
    const Icon = isSuccess ? CheckCircle : AlertCircle

    return (
        <div className={cn(
            "text-white p-6",
            isSuccess ? "bg-emerald-500" : "bg-red-500"
        )}>
            <DialogHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-white font-semibold">{title}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>
        </div>
    )
}

// Componente para el mensaje principal
function MessageSection({ message }: { message: string }) {
    if (!message) return null

    return (
        <div className="px-6 pt-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-700 font-medium leading-relaxed">
                    {message}
                </p>
            </div>
        </div>
    )
}

// Componente para cada error individual
function ErrorItem({ error }: { error: Error }) {
    return (
        <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-3 font-bold">Campos requeridos:</p>
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-700">{error.title}</span>
                <div className="ml-auto">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        Obligatorio
                    </span>
                </div>
            </div>
            {error.message && (
                <p className="text-sm text-slate-500 mt-2">{error.message}</p>
            )}
        </div>
    )
}

// Componente para la lista de errores
function ErrorsSection({ errors }: { errors: Error[] }) {
    if (!errors || errors.length === 0) return null

    return (
        <div className="space-y-4">
            {errors.map((error, index) => (
                <ErrorItem key={index} error={error} />
            ))}
        </div>
    )
}

// Componente principal
export default function ResultModalNew({
    errors,
    message,
    onClose,
    open,
    status,
    title
}: ResultModalNewProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md md:max-w-lg rounded-lg gap-0 border-0 p-0 overflow-hidden">
                <ModalHeader title={title} status={status} />

                <MessageSection message={message} />

                <div className="p-6 space-y-4">
                    <ErrorsSection errors={errors} />

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-2 justify-end">
                        <Button variant="gray" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}