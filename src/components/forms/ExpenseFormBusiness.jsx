import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { maskCurrency, parseUserValue } from '../../utils/formatters'

export default function ExpenseFormBusiness({ expense, onSave, onCancel }) {
    const [description, setDescription] = useState(() => expense?.description || '')
    const [valueStr, setValueStr] = useState(() => (expense ? String(expense.value ?? '') : ''))

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>{expense ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!expense && (
                    <div className="px-1">
                        <p className="text-sm font-medium mb-2">Como cadastrar uma despesa:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                            <li>Descreva o custo, como "Fornecedor Y"</li>
                            <li>Informe o valor gasto no período</li>
                            <li>O resultado do período será atualizado automaticamente</li>
                        </ol>
                    </div>
                )}

                <div>
                    <Label className="mb-2" htmlFor="expenseDescription">Descrição</Label>
                    <Input
                        id="expenseDescription"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="expenseValue">Valor</Label>
                    <Input
                        id="expenseValue"
                        type="text"
                        inputMode="numeric"
                        value={valueStr}
                        placeholder="0,00"
                        onChange={(e) => setValueStr(maskCurrency(e.target.value))}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            const val = parseUserValue(valueStr)
                            if (!description.trim()) return
                            onSave({ description: description.trim(), value: Number.isNaN(val) ? 0 : val })
                        }}
                    >
                        Salvar
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
