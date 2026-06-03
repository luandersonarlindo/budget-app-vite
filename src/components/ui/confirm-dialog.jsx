import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog'

import { Button } from './button'

function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Remover',
    cancelLabel = 'Cancelar',
    destructive = true,
    onConfirm,
    onCancel
}) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
                    <Button
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog
