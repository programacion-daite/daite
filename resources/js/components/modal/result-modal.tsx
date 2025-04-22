import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
   } from '@/components/ui/alert-dialog';


   interface ResultModal {
    open: boolean;
    onClose: () => void;
    titulo: string;
    mensaje: string;
   }


   export const ResultModal: React.FC<ResultModal> = ({
    open,
    onClose,
    titulo,
    mensaje,
   }) => {
    return (
    <AlertDialog open={open}>
    <AlertDialogContent>
    <AlertDialogHeader>
    <AlertDialogTitle>{titulo}</AlertDialogTitle>
    <AlertDialogDescription>{mensaje}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
    <AlertDialogAction onClick={onClose}>Cerrar</AlertDialogAction>
    </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    );
   };
