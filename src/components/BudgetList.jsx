import { Copy, Pencil, PiggyBank, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { getProgressColor } from '../utils/progressColor'
import EmptyState from './EmptyState'
import { Button } from './ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'

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
            {budgets.map((budget) => {
                const totalExpenses = budget.categories?.flatMap(c => c.expenses || []).length ?? 0
                const totalSpent = budget.categories?.flatMap(c => c.expenses || []).reduce((sum, e) => sum + (Number(e.value) || 0), 0) ?? 0
                const percentSpent = budget.value > 0 ? (totalSpent / budget.value) * 100 : 0

                return (
                    <Card key={budget.id} className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="pb-2">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Orçamento
                            </p>
                            <CardTitle className="text-lg">{budget.name}</CardTitle>
                            <p className="text-3xl font-bold text-foreground">
                                {formatCurrency(budget.value)}
                            </p>
                            <div className="space-y-1 mt-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{totalExpenses} despesa{totalExpenses !== 1 ? 's' : ''}</span>
                                    <span className={percentSpent > 100 ? 'text-red-500 font-medium' : ''}>
                                        {percentSpent.toFixed(1)}% gasto
                                    </span>
                                </div>
                                <Progress
                                    value={Math.min(percentSpent, 100)}
                                    className={`mt-1 ${getProgressColor(percentSpent)}`}
                                />
                            </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                            <Button className="w-full" onClick={() => onSelect(budget)}>
                                Ver despesas
                            </Button>
                            <div className="flex gap-1 w-full justify-end">
                                <Button variant="outline" size="icon" onClick={() => onEdit(budget.id)} title="Editar">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => onCopy(budget.id)} title="Copiar">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(budget.id)}
                                    title="Deletar"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

export default BudgetList