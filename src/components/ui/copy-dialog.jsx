import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog'
import { Input } from './input'
import { Button } from './button'

function CopyDialog({ open, initialName = '', title = 'Copiar período', description = 'Informe o nome para a cópia do período.', onCancel, onConfirm }) {
    const [name, setName] = useState(initialName)

    useEffect(() => {
        setName(initialName || '')
    }, [initialName, open])

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-2">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da cópia" />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm && onConfirm(name)}>
                        Copiar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CopyDialog
