import EmptyState from './EmptyState'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'
import { Pencil, Copy, Trash2, PiggyBank } from 'lucide-react'

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
                <Card key={budget.id} className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Orçamento
                        </p>
                        <CardTitle className="text-lg">{budget.name}</CardTitle>
                        <p className="text-3xl font-bold text-foreground">
                            {formatCurrency(budget.value)}
                        </p>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-2 pt-4 border-t">
                        <Button
                            className="flex-1"
                            onClick={() => onSelect(budget)}
                        >
                            Ver despesas
                        </Button>
                        <div className="flex gap-1 shrink-0">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onEdit(budget.id)}
                                title="Editar"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onCopy(budget.id)}
                                title="Copiar"
                            >
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
            ))}
        </div>
    )
}

export default BudgetList