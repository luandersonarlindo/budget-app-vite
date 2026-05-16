import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog'
import { Input } from './input'
import { maskCurrency, parseUserValue } from '../../utils/formatters'

function CopyDialog({
    open,
    initialName = '',
    initialValue = '',
    title = 'Copiar período',
    description = 'Informe o nome para a cópia do período.',
    showValueField = false,
    valueLabel = 'Valor',
    valuePlaceholder = '0,00',
    onCancel,
    onConfirm
}) {
    const [name, setName] = useState(initialName)
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setName(initialName || '')
        setValue(initialValue ?? '')
    }, [initialName, initialValue, open])

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

                {showValueField && (
                    <div className="mt-2">
                        <label className="text-sm text-muted-foreground">{valueLabel}</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={value}
                            onChange={(e) => setValue(maskCurrency(e.target.value))}
                            placeholder={valuePlaceholder}
                        />
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (!onConfirm) return
                            if (showValueField) {
                                onConfirm({ name, value: parseUserValue(value) })
                                return
                            }
                            onConfirm(name)
                        }}
                    >
                        Copiar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CopyDialog
