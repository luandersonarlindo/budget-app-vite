import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'
import EmptyState from './EmptyState'
import { TrendingUp, Pencil, Trash2 } from 'lucide-react'

function IncomeList({ incomes, onEdit, onRemove, onAddNew }) {
    if (!incomes?.length) {
        return (
            <EmptyState
                icon={TrendingUp}
                title="Nenhuma receita registrada"
                description="Adicione receitas para acompanhar o desempenho do período."
                actionLabel="Adicionar Receita"
                onAction={onAddNew}
            />
        )
    }

    return (
        <div className="space-y-3">
            {incomes.map((income) => (
                <div key={income.id} className="flex items-center justify-between gap-3">
                    <div>
                        <div className="font-medium">{income.description}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(Number(income.value) || 0)}</div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(income)}
                            title="Editar"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemove(income)}
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

export default IncomeList
