import { CheckCircle, XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ResultModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  status: "success" | "error"
}

export default function ResultModal({ open, onClose, title, message, status }: ResultModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md border-0 shadow-lg">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1.5 rounded-t-lg",
            status === "success" ? "bg-emerald-500" : "bg-red-500",
          )}
        />
        <AlertDialogHeader className="pt-6">
          <div className="flex items-center gap-3">
            {status === "success" ? (
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <AlertDialogTitle className="text-xl font-medium">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-sm text-black">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white transition-colors",
              status === "success" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600",
            )}
          >
            Cerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
