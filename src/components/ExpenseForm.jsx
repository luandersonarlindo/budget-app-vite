import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { maskCurrency, parseUserValue } from '../utils/formatters';
import { Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip'

function ExpenseForm({ budget, expenseToEdit, onSave, onCancel }) {
    const [categoryId, setCategoryId] = useState(expenseToEdit?.categoryId || budget?.categories?.[0]?.id || '')
    const [descricao, setDescricao] = useState(expenseToEdit ? expenseToEdit.description : '')
    const [valor, setValor] = useState(expenseToEdit ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(expenseToEdit.value) : '0,00')

    function handleSalvar() {
        if (descricao.trim() === '' || valor === '') return

        onSave({
            categoryId,
            expense: {
                description: descricao,
                value: parseUserValue(valor),
                status: expenseToEdit?.status || 'pendente'
            }
        })

        setDescricao('')
        setValor('')
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle>{expenseToEdit ? 'Editar Despesa' : 'Adicionar Despesa'}</CardTitle>
                        {!expenseToEdit && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <ol className="text-sm space-y-1 list-decimal list-inside">
                                            <li>Informe uma descrição clara, como "Aluguel" ou "Mercado"</li>
                                            <li>Informe o valor da despesa</li>
                                            <li>O status padrão é "Pendente" — altere conforme o pagamento</li>
                                        </ol>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardHeader>


                <CardContent className="flex flex-col gap-4">
                    <div>
                        <Label className="mb-2" htmlFor="categoria">Categoria</Label>
                        <Select
                            value={categoryId}
                            onValueChange={(value) => setCategoryId(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {budget.categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="descricao">Descrição</Label>
                        <Input id="descricao" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    </div>
                    <div>
                        <Label className="mb-2" htmlFor="valor">Valor</Label>
                        <Input id="valor" type="text" inputMode="numeric" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} />
                    </div>

                    <div className="flex gap-2">
                        <Button variant={'default'} onClick={handleSalvar}>Salvar</Button>
                        <Button variant={'destructive'} onClick={onCancel}>Cancelar</Button>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default ExpenseForm