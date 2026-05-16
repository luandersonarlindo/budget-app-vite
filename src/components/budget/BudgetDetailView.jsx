import { Button } from '../ui/button'
import ErrorAlert from '../ui/error-alert'
import ExpenseList from '../ExpenseList'

/**
 * BudgetDetailView - Tela de despesas de um orçamento
 * 
 * Props:
 * - budget: object
 *     The selected budget object containing categories and expenses
 *     
 * - expenseError: string | null
 *     Error message to display (null if no error)
 *     
 * - onBack: function
 *     Callback to navigate back to budget list (tela = 'lista')
 *     
 * - onAddExpense: function
 *     Callback to navigate to expense form for creation (tela = 'formularioDespesa')
 *     
 * - onEditExpense: function(categoryId, expenseId, expense)
 *     Callback when user clicks edit on an expense
 *     Must navigate to expense form (tela = 'formularioDespesa')
 *     
 * - onDeleteExpense: function(categoryId, expenseId, description)
 *     Callback when user clicks delete on an expense
 *     Expected to set up confirmation dialog state
 *     
 * - onMoveExpense: function(fromCategoryId, expenseId, toCategoryId)
 *     Callback when user moves expense between categories
 *     Expected to call moveExpense hook function and update selectedBudget
 *     
 * - onUpdateStatus: function(categoryId, expenseId, status)
 *     Callback when user toggles expense status (completed/pending)
 *     Expected to call updateExpenseStatus hook function and update selectedBudget
 *     
 * - onClearError: function
 *     Callback to clear the expense error message
 */

function BudgetDetailView({
    budget,
    expenseError,
    onBack,
    onAddExpense,
    onEditExpense,
    onDeleteExpense,
    onMoveExpense,
    onUpdateStatus,
    onClearError
}) {
    return (
        <div>
            <ErrorAlert message={expenseError} onClose={onClearError} />

            <h2 className="text-3xl font-bold text-black m-6 p-3 text-center">Despesas: {budget.name}</h2>

            <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="default" onClick={onAddExpense}>
                    Adicionar Despesa
                </Button>

                <Button variant="secondary" onClick={onBack}>
                    Voltar
                </Button>
            </div>

            <ExpenseList
                budget={budget}
                onDeleteExpense={onDeleteExpense}
                onEditExpense={onEditExpense}
                onMoveExpense={onMoveExpense}
                onUpdateStatus={onUpdateStatus}
                onAddNew={onAddExpense}
            />
        </div>
    )
}

export default BudgetDetailView
