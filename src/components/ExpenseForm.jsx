import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { maskCurrency, parseUserValue } from '../utils/formatters';

function ExpenseForm({ budget, expenseToEdit, onSave, onCancel }) {
    const [categoryIndex, setCategoryIndex] = useState(expenseToEdit ? expenseToEdit.categoryIndex : 0)
    const [descricao, setDescricao] = useState(expenseToEdit ? expenseToEdit.description : '')
    const [valor, setValor] = useState(expenseToEdit ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(expenseToEdit.value) : '0,00')

    function handleSalvar() {
        if (descricao.trim() === '' || valor === '') return

        onSave({
            categoryIndex: parseInt(categoryIndex),
            expense: { description: descricao, value: parseUserValue(valor) }
        })

        setDescricao('')
        setValor('')
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{expenseToEdit ? 'Editar Despesa' : 'Adicionar Despesa'}</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <div>
                        <Label className="mb-2" htmlFor="categoria">Categoria</Label>
                        <Select
                            value={categoryIndex.toString()}
                            onValueChange={(value) => setCategoryIndex(parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {budget.categories.map((cat, i) => (
                                    <SelectItem key={i} value={i.toString()}>{cat.name}</SelectItem>
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
                        <Input id="valor" type="text" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} />
                    </div>

                    <div className="flex gap-2">
                        <Button variant={'default'} onClick={handleSalvar}>Salvar</Button>
                        <Button variant={'destructive'} onClick={onCancel}>Cancelar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ExpenseForm