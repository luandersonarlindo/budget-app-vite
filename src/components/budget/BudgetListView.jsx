import { Button } from '../ui/button'
import { CardContent } from '../ui/card'
import BudgetList from '../BudgetList'

function BudgetListView({
    budgets,
    onNewBudget,
    onManageCategories,
    onSelectBudget,
    onDeleteBudget,
    onEditBudget,
    onCopyBudget
}) {
    return (
        <div>
            <CardContent className="flex flex-wrap gap-2 p-0">
                <Button variant="default" className="mb-4" onClick={onNewBudget}>
                    Adicionar Orçamento
                </Button>

                <Button variant="secondary" className="mb-4" onClick={onManageCategories}>
                    Gerenciar Categorias
                </Button>
            </CardContent>

            <BudgetList
                budgets={budgets}
                onSelect={onSelectBudget}
                onDelete={onDeleteBudget}
                onEdit={onEditBudget}
                onCopy={onCopyBudget}
                onAddNew={onNewBudget}
            />
        </div>
    )
}

export default BudgetListView
