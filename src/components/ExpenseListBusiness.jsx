import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'
import EmptyState from './EmptyState'
import { TrendingDown, Pencil, Trash2 } from 'lucide-react'

function ExpenseListBusiness({ expenses, onEdit, onRemove, onAddNew }) {
    if (!expenses?.length) {
        return (
            <EmptyState
                icon={TrendingDown}
                title="Nenhuma despesa registrada"
                description="Adicione despesas para manter o controle do período."
                actionLabel="Adicionar Despesa"
                onAction={onAddNew}
            />
        )
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between gap-3">
                    <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(Number(expense.value) || 0)}</div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(expense)}
                            title="Editar"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemove(expense)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ExpenseListBusiness
