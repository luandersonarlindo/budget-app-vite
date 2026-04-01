import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { maskCurrency, parseUserValue } from '../utils/formatters';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

function BudgetForm({ availableCategories, onSave, onCancel, budgetToEdit }) {
    const [nome, setNome] = useState(budgetToEdit?.name || '')
    const [valor, setValor] = useState( budgetToEdit ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(budgetToEdit.value) : '0,00')
    const [personalizado, setPersonalizado] = useState(false)
    const [categorias, setCategorias] = useState(() => {
        if (budgetToEdit) {
            return availableCategories.map(cat => {
                const catNoOrcamento = budgetToEdit.categories.find(c => c.id === cat.id)
                return catNoOrcamento
                    ? { ...cat, percent: catNoOrcamento.percent, expenses: catNoOrcamento.expenses, selected: true }
                    : { ...cat, percent: cat.defaultPercent || 0, expenses: [], selected: false }
            })
        }
        return availableCategories.map(cat => ({
            ...cat,
            percent: cat.defaultPercent || 0,
            expenses: [],
            selected: true
        }))
    })
    const [formError, setFormError] = useState(null)
    const CATEGORIAS_PADRAO_IDS = ['essenciais', 'financeiras', 'estilo']

    function handleSalvar() {
        if (nome.trim() === '' || valor === '') return

        if (personalizado) {
            const soma = categorias
                .filter(cat => cat.selected)
                .reduce((acc, cat) => acc + cat.percent, 0)
            if (soma !== 100) {
                setFormError('A soma dos percentuais deve ser 100%')
                return
            }
        }

        const novoOrcamento = {
            name: nome,
            value: parseUserValue(valor),
            categories: personalizado
                ? categorias.filter(cat => cat.selected)
                : (budgetToEdit
                    ? budgetToEdit.categories
                    : availableCategories
                        .filter(cat => CATEGORIAS_PADRAO_IDS.includes(cat.id))
                        .map(cat => ({
                            ...cat,
                            percent: cat.defaultPercent || 0,
                            expenses: []
                        })))
        }

        onSave(novoOrcamento)
        setNome('')
        setValor('')
        setPersonalizado(false)
        setCategorias(availableCategories.map(cat => ({ ...cat, percent: 0, expenses: [] })))
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{budgetToEdit ? 'Editar Orçamento' : 'Novo Orçamento'}</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="mb-2" htmlFor="nome">Nome do orçamento</Label>
                        <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="valor">Valor</Label>
                        <Input id="valor" type="text" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))}/>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-3">

                        <div className="mb-4 mt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Switch checked={personalizado} onCheckedChange={setPersonalizado} />
                                <Label>Personalizar categorias</Label>
                            </div>
                        </div>

                        {personalizado && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-8 mx-0">
                                {categorias.map((cat, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`cat-${i}`}
                                                checked={cat.selected}
                                                onCheckedChange={(checked) => {
                                                    const novasCategorias = categorias.map((c, ci) =>
                                                        ci === i ? { ...c, selected: checked } : c
                                                    )
                                                    setCategorias(novasCategorias)
                                                }}
                                            />
                                            <Label htmlFor={`cat-${i}`}>{cat.name}</Label>
                                        </div>
                                        {cat.selected && (
                                            <div className="relative">
                                                <Input
                                                    className="pr-8"
                                                    type="number"
                                                    value={cat.percent}
                                                    onChange={(e) => {
                                                        const novasCategorias = categorias.map((c, ci) =>
                                                            ci === i ? { ...c, percent: parseInt(e.target.value) } : c
                                                        )
                                                        setCategorias(novasCategorias)
                                                    }}
                                                />
                                                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {formError && (
                        <div className="col-span-1 md:col-span-2">
                            <Alert variant="destructive">
                                <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-2">
                        <Button onClick={handleSalvar}>Salvar</Button>
                        <Button variant="destructive" onClick={onCancel}>Cancelar</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default BudgetForm