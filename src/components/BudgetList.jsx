import { PiggyBank } from 'lucide-react'
import EmptyState from './EmptyState'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'

function BudgetList({ budgets, onSelect, onDelete, onEdit, onCopy, onAddNew }) {
    if (budgets.length === 0) {
        return (
            <EmptyState
                icon={PiggyBank}
                title="Nenhum orçamento cadastrado"
                description="Crie seu primeiro orçamento para começar a controlar suas finanças."
                actionLabel="Adicionar Orçamento"
                onAction={onAddNew}
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
                <Card key={budget.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>{budget.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{formatCurrency(budget.value)}</p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                        <Button onClick={() => onSelect(budget)}>Ver despesas</Button>
                        <Button variant="outline" onClick={() => onEdit(budget.id)}>Editar</Button>
                        <Button variant="secondary" onClick={() => onCopy(budget.id)}>Copiar</Button>
                        <Button variant="destructive" onClick={() => onDelete(budget.id)}>Deletar</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default BudgetList