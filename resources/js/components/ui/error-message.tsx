import { CircleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export default function errorMessage({ className = '', message, ...props }: ErrorMessageProps) {
    return (
        <div className={cn('flex items-center space-x-2 bg-red-100 text-red-600 p-2 rounded-md mb-4', className)} {...props}>
        <CircleAlertIcon className="h-5 w-5" />
        <span className="text-sm font-semibold">{message}</span>
        </div>
    );
}
