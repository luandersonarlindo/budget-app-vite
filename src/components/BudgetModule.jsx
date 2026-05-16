import { useState } from 'react'
import BudgetForm from './BudgetForm'
import ExpenseForm from './ExpenseForm'
import CategoryForm from './CategoryForm'
import ConfirmDialog from './ui/confirm-dialog'
import CopyDialog from './ui/copy-dialog'
import BudgetListView from './budget/BudgetListView'
import BudgetDetailView from './budget/BudgetDetailView'
import CategoryManagerView from './budget/CategoryManagerView'
import useBudgets from '../hooks/useBudgets'
import useCategories from '../hooks/useCategories'

function BudgetModule() {
    const {
        budgets,
        addBudget,
        updateBudget,
        removeBudget,
        copyBudget,
        addExpense,
        updateExpense,
        removeExpense,
        moveExpense,
        moveAndUpdateExpense,
        updateExpenseStatus
    } = useBudgets()

    const {
        categories,
        addCategory,
        updateCategory,
        removeCategory
    } = useCategories()

    const [tela, setTela] = useState('lista')

    const [selectedBudget, setSelectedBudget] = useState(null)
    const [selectedBudgetId, setSelectedBudgetId] = useState(null)
    const [budgetToEdit, setBudgetToEdit] = useState(null)
    const [editBudgetId, setEditBudgetId] = useState(null)

    const [expenseToEdit, setExpenseToEdit] = useState(null)
    const [editCategoryId, setEditCategoryId] = useState(null)
    const [editExpenseId, setEditExpenseId] = useState(null)

    const [categoryToEdit, setCategoryToEdit] = useState(null)
    const [categoryEditId, setCategoryEditId] = useState(null)

    const [budgetToRemove, setBudgetToRemove] = useState(null)
    const [expenseToRemove, setExpenseToRemove] = useState(null)
    const [categoryToRemove, setCategoryToRemove] = useState(null)
    const [copyTarget, setCopyTarget] = useState(null)

    const [expenseError, setExpenseError] = useState(null)
    const [categoryError, setCategoryError] = useState(null)

    return (
        <div>
            {tela === 'lista' && (
                <BudgetListView
                    budgets={budgets}
                    onNewBudget={() => setTela('formulario')}
                    onManageCategories={() => setTela('categorias')}
                    onSelectBudget={(budget) => {
                        setSelectedBudget(budget)
                        setSelectedBudgetId(budget.id)
                        setTela('despesas')
                    }}
                    onDeleteBudget={(budgetId) => setBudgetToRemove(budgets.find((budget) => budget.id === budgetId) || null)}
                    onEditBudget={(budgetId) => {
                        const budget = budgets.find((item) => item.id === budgetId) || null
                        setBudgetToEdit(budget)
                        setEditBudgetId(budgetId)
                        setTela('formulario')
                    }}
                    onCopyBudget={(budgetId) => {
                        const budget = budgets.find((item) => item.id === budgetId) || null
                        setCopyTarget(budget)
                    }}
                />
            )}

            {tela === 'formulario' && (
                <BudgetForm
                    availableCategories={categories}
                    budgetToEdit={budgetToEdit}
                    onCancel={() => {
                        setBudgetToEdit(null)
                        setEditBudgetId(null)
                        setTela('lista')
                    }}
                    onSave={(newBudget) => {
                        if (budgetToEdit) {
                            updateBudget(editBudgetId, newBudget)
                            if (selectedBudgetId === editBudgetId) {
                                setSelectedBudget(newBudget)
                            }
                        } else {
                            addBudget(newBudget)
                        }
                        setBudgetToEdit(null)
                        setEditBudgetId(null)
                        setTela('lista')
                    }}
                />
            )}

            {tela === 'despesas' && selectedBudget && (
                <BudgetDetailView
                    budget={selectedBudget}
                    expenseError={expenseError}
                    onBack={() => setTela('lista')}
                    onAddExpense={() => setTela('formularioDespesa')}
                    onEditExpense={(categoryId, expenseId, expense) => {
                        setExpenseToEdit({ ...expense, categoryId })
                        setEditCategoryId(categoryId)
                        setEditExpenseId(expenseId)
                        setTela('formularioDespesa')
                    }}
                    onDeleteExpense={(categoryId, expenseId, description) => {
                        setExpenseToRemove({ categoryId, expenseId, description })
                    }}
                    onMoveExpense={(fromCategoryId, expenseId, toCategoryId) => {
                        const updatedBudget = moveExpense(selectedBudgetId, fromCategoryId, expenseId, toCategoryId)
                        if (updatedBudget) setSelectedBudget(updatedBudget)
                    }}
                    onUpdateStatus={(categoryId, expenseId, status) => {
                        const updatedBudget = updateExpenseStatus(selectedBudgetId, categoryId, expenseId, status)
                        if (updatedBudget) setSelectedBudget(updatedBudget)
                    }}
                    onClearError={() => setExpenseError(null)}
                />
            )}

            {tela === 'formularioDespesa' && (
                <ExpenseForm
                    expenseToEdit={expenseToEdit}
                    budget={selectedBudget}
                    onCancel={() => {
                        setExpenseToEdit(null)
                        setEditCategoryId(null)
                        setEditExpenseId(null)
                        setTela('despesas')
                    }}
                    onSave={({ categoryId, expense }) => {
                        let updatedBudget
                        if (expenseToEdit) {
                            if (categoryId !== editCategoryId) {
                                updatedBudget = moveAndUpdateExpense(
                                    selectedBudgetId,
                                    editCategoryId,
                                    editExpenseId,
                                    categoryId,
                                    expense
                                )
                            } else {
                                updatedBudget = updateExpense(selectedBudgetId, editCategoryId, editExpenseId, expense)
                            }
                        } else {
                            updatedBudget = addExpense(selectedBudgetId, categoryId, expense)
                        }

                        if (updatedBudget) setSelectedBudget(updatedBudget)
                        setExpenseToEdit(null)
                        setEditCategoryId(null)
                        setEditExpenseId(null)
                        setTela('despesas')
                    }}
                />
            )}

            {tela === 'categorias' && (
                <CategoryManagerView
                    categories={categories}
                    categoryError={categoryError}
                    onBack={() => {
                        setTela('lista')
                        setCategoryToEdit(null)
                        setCategoryEditId(null)
                    }}
                    onAddCategory={() => setTela('formularioCategoria')}
                    onEditCategory={(category) => {
                        setCategoryToEdit(category)
                        setCategoryEditId(category.id)
                        setTela('formularioCategoria')
                    }}
                    onDeleteCategory={(category) => {
                        const emUso = budgets.some((budget) =>
                            (budget.categories || []).some((budgetCategory) => budgetCategory.id === category.id)
                        )

                        if (emUso) {
                            setCategoryError(`A categoria "${category.name}" está em uso em um ou mais orçamentos e não pode ser removida.`)
                        } else {
                            setCategoryToRemove(category)
                        }
                    }}
                    onClearError={() => setCategoryError(null)}
                />
            )}

            {tela === 'formularioCategoria' && (
                <CategoryForm
                    categoryToEdit={categoryToEdit}
                    onCancel={() => {
                        setCategoryToEdit(null)
                        setCategoryEditId(null)
                        setTela('categorias')
                    }}
                    onSave={(newCategory) => {
                        if (categoryEditId !== null) {
                            updateCategory(categoryEditId, newCategory)
                        } else {
                            addCategory(newCategory)
                        }
                        setCategoryToEdit(null)
                        setCategoryEditId(null)
                        setTela('categorias')
                    }}
                />
            )}

            {budgetToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover orçamento"
                    description={`Tem certeza que deseja remover "${budgetToRemove.name}"?`}
                    onCancel={() => setBudgetToRemove(null)}
                    onConfirm={() => {
                        removeBudget(budgetToRemove.id)
                        if (selectedBudgetId === budgetToRemove.id) {
                            setSelectedBudget(null)
                            setSelectedBudgetId(null)
                            setTela('lista')
                        }
                        setBudgetToRemove(null)
                    }}
                />
            )}

            {expenseToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover despesa"
                    description={`Tem certeza que deseja remover "${expenseToRemove.description || 'esta despesa'}"?`}
                    onCancel={() => setExpenseToRemove(null)}
                    onConfirm={() => {
                        const updatedBudget = removeExpense(
                            selectedBudgetId,
                            expenseToRemove.categoryId,
                            expenseToRemove.expenseId
                        )
                        if (updatedBudget) setSelectedBudget(updatedBudget)
                        setExpenseToRemove(null)
                    }}
                />
            )}

            {categoryToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover categoria"
                    description={`Tem certeza que deseja remover "${categoryToRemove.name}"?`}
                    onCancel={() => setCategoryToRemove(null)}
                    onConfirm={() => {
                        removeCategory(categoryToRemove.id)
                        setCategoryToRemove(null)
                    }}
                />
            )}

            {copyTarget && (
                <CopyDialog
                    open={true}
                    title="Copiar orçamento"
                    description="Digite um novo nome para a cópia do orçamento"
                    initialName={`${copyTarget.name} (cópia)`}
                    initialValue={copyTarget.value ?? ''}
                    showValueField={true}
                    valueLabel="Valor do orçamento"
                    valuePlaceholder="0,00"
                    onCancel={() => setCopyTarget(null)}
                    onConfirm={({ name, value }) => {
                        const parsedValue = Number(value)
                        copyBudget(
                            copyTarget.id,
                            name?.trim() ? name.trim() : `${copyTarget.name} (cópia)`,
                            Number.isNaN(parsedValue) ? copyTarget.value : parsedValue
                        )
                        setCopyTarget(null)
                    }}
                />
            )}
        </div>
    )
}

export default BudgetModule