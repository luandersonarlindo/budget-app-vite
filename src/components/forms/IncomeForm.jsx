import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { maskCurrency, parseUserValue } from '../../utils/formatters'

export default function IncomeForm({ income, onSave, onCancel }) {
    const [description, setDescription] = useState(() => income?.description || '')
    const [valueStr, setValueStr] = useState(() => (income ? String(income.value ?? '') : ''))

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>{income ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!income && (
                    <div className="px-1">
                        <p className="text-sm font-medium mb-2">Como cadastrar uma receita:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                            <li>Descreva a origem da receita, como "Venda X"</li>
                            <li>Informe o valor recebido no período</li>
                            <li>O resultado do período será atualizado automaticamente</li>
                        </ol>
                    </div>
                )}

                <div>
                    <Label className="mb-2" htmlFor="incomeDescription">Descrição</Label>
                    <Input
                        id="incomeDescription"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="incomeValue">Valor</Label>
                    <Input
                        id="incomeValue"
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
