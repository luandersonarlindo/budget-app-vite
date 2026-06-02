import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { maskCurrency, parseUserValue } from '../../utils/formatters'
import { Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'

export default function IncomeForm({ income, onSave, onCancel }) {
    const [description, setDescription] = useState(() => income?.description || '')
    const [valueStr, setValueStr] = useState(() => (income ? String(income.value ?? '') : ''))

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{income ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
                    {!income && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <ol className="text-sm space-y-1 list-decimal list-inside">
                                        <li>Descreva a origem da receita, como "Venda X"</li>
                                        <li>Informe o valor recebido no período</li>
                                        <li>O resultado será atualizado automaticamente</li>
                                    </ol>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">

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
