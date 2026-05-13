import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'
import EmptyState from './EmptyState'
import { TrendingDown } from 'lucide-react'

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
                            variant="secondary"
                            onClick={() => onEdit(expense)}
                        >
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemove(expense)}
                        >
                            Remover
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ExpenseListBusiness
