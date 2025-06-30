import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
   } from '@/components/ui/alert-dialog';


   interface ConfirmModal {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    mensaje?: string;
   }


   export const ConfirmModal: React.FC<ConfirmModal> = ({
    mensaje = '¿Deseas enviar el formulario? Esta acción no se puede deshacer.',
    onClose,
    onConfirm,
    open,
   }) => {
    return (
    <AlertDialog open={open}>
    <AlertDialogContent>
    <AlertDialogHeader>
    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
    <AlertDialogDescription>{mensaje}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
    <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
    </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    );
   };
