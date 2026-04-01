import { useState } from 'react'
import BudgetForm from './components/BudgetForm'
import BudgetList from './components/BudgetList'
import CategoryForm from './components/CategoryForm'
import CategoryManager from './components/CategoryManager'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

import { Alert, AlertDescription } from './components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog'
import { Button } from './components/ui/button'
import { CardContent } from './components/ui/card'
import useBudgets from './hooks/useBudgets'
import useCategories from './hooks/useCategories'
import useExpenses from './hooks/useExpenses'

function App() {
  const { budgets, setBudgets, copyBudget } = useBudgets()
  const { addExpense, updateExpense, deleteExpense, moveExpense, moveAndUpdateExpense } = useExpenses(budgets, setBudgets)

  const [tela, setTela] = useState('lista')
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(null)
  const [budgetToEdit, setBudgetToEdit] = useState(null)

  const [editIndex, setEditIndex] = useState(null)
  const [expenseToEdit, setExpenseToEdit] = useState(null)
  const [editCategoryIndex, setEditCategoryIndex] = useState(null)
  const [expenseEditIndex, setExpenseEditIndex] = useState(null)

  const { categories, addCategory, updateCategory, removeCategory } = useCategories()
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryEditId, setCategoryEditId] = useState(null)

  const [budgetError, setBudgetError] = useState(null)
  const [budgetToRemove, setBudgetToRemove] = useState(null)
  const [expenseError, setExpenseError] = useState(null)
  const [expenseToRemove, setExpenseToRemove] = useState(null)
  const [categoryError, setCategoryError] = useState(null)
  const [categoryToRemove, setCategoryToRemove] = useState(null)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {budgetError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{budgetError}</AlertDescription>
          <button onClick={() => setBudgetError(null)}>✕</button>
        </Alert>
      )}

      <h1 className="text-5xl font-bold text-black m-6 p-3 text-center">Budget App</h1>
      {tela === 'lista' && (
        <div>
          <CardContent className="flex flex-wrap gap-2 p-0">
            <Button variant={'default'} className="mb-4" onClick={() => setTela('formulario')}>
              Adicionar Orçamento
            </Button>

            <Button variant={'secondary'} className="mb-4" onClick={() => setTela('categorias')}>
              Gerenciar Categorias
            </Button>
          </CardContent>

          <BudgetList budgets={budgets}
            onSelect={(budget, index) => {
              setSelectedBudget(budget)
              setSelectedBudgetIndex(index)
              setTela('despesas')
            }}
            onDelete={(index) => setBudgetToRemove({ ...budgets[index], index })}
            onEdit={(index) => {
              setBudgetToEdit(budgets[index])
              setEditIndex(index)
              setTela('formulario')
            }}
            onCopy={copyBudget}
          />

        </div>
      )}

      {tela === 'formulario' && (
        <BudgetForm
          availableCategories={categories}
          budgetToEdit={budgetToEdit}
          onCancel={() => {
            setBudgetToEdit(null)
            setEditIndex(null)
            setTela('lista')
          }}
          onSave={(newBudget) => {
            if (editIndex !== null) {
              setBudgets(budgets.map((b, i) => i === editIndex ? newBudget : b))
              setEditIndex(null)
              setBudgetToEdit(null)
            } else {
              setBudgets([...budgets, newBudget])
            }
            setTela('lista')
          }}

        />
      )}

      {tela === 'despesas' && (
        <div>
          {expenseError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{expenseError}</AlertDescription>
              <button onClick={() => setExpenseError(null)}>✕</button>
            </Alert>
          )}

          <h2 className="text-3xl font-bold text-black m-6 p-3 text-center">Despesas: {selectedBudget.name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={'default'} onClick={() => setTela('formularioDespesa')}>
              Adicionar Despesa
            </Button>

            <Button variant={'secondary'} onClick={() => setTela('lista')}>
              Voltar
            </Button>
          </div>

          <ExpenseList budget={selectedBudget}
            onDeleteExpense={(categoryIndex, expenseIndex) => {
              setExpenseToRemove({ categoryIndex, expenseIndex, description: selectedBudget.categories[categoryIndex].expenses[expenseIndex].description })
            }}
            onEditExpense={(categoryIndex, expenseIndex, expense) => {
              setExpenseToEdit({ ...expense, categoryIndex })
              setEditCategoryIndex(categoryIndex)
              setExpenseEditIndex(expenseIndex)
              setTela('formularioDespesa')
            }}
            onMoveExpense={(fromCat, expIndex, toCat) => {
              const budgetAtualizado = moveExpense(selectedBudgetIndex, fromCat, expIndex, toCat)
              setSelectedBudget(budgetAtualizado)
            }}
            onUpdateStatus={(catIndex, expIndex, status) => {
              const budgetAtualizado = updateExpense(
                selectedBudgetIndex,
                catIndex,
                expIndex,
                { ...selectedBudget.categories[catIndex].expenses[expIndex], status }
              )
              setSelectedBudget(budgetAtualizado)
            }}
          />
        </div>
      )}

      {tela === 'formularioDespesa' && (
        <ExpenseForm
          expenseToEdit={expenseToEdit}
          budget={selectedBudget}
          onCancel={() => {
            setExpenseToEdit(null)
            setEditCategoryIndex(null)
            setExpenseEditIndex(null)
            setTela('despesas')
          }}
          onSave={({ categoryIndex, expense }) => {
            let budgetAtualizado
            if (expenseEditIndex !== null) {
              if (categoryIndex !== editCategoryIndex) {
                budgetAtualizado = moveAndUpdateExpense(selectedBudgetIndex, editCategoryIndex, expenseEditIndex, categoryIndex, expense)
              } else {
                budgetAtualizado = updateExpense(selectedBudgetIndex, editCategoryIndex, expenseEditIndex, expense)
              }
              setExpenseToEdit(null)
              setExpenseEditIndex(null)
              setEditCategoryIndex(null)
            } else {
              budgetAtualizado = addExpense(selectedBudgetIndex, categoryIndex, expense)
            }
            setSelectedBudget(budgetAtualizado)
            setTela('despesas')
          }}
        />
      )}

      {tela === 'categorias' && (
        <div>
          {categoryError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{categoryError}</AlertDescription>
              <button onClick={() => setCategoryError(null)}>✕</button>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={'default'} onClick={() => setTela('formularioCategoria')}>
              Adicionar Categoria
            </Button>

            <Button variant={'secondary'} onClick={() => {
              setCategoryError(null)
              setTela('lista')
            }}>
              Voltar
            </Button>
          </div>

          <CategoryManager
            categories={categories}
            onSave={(newCategories) => {
              addCategory(newCategories)
              setTela('lista')
            }}
            onCancel={() => setTela('lista')}
            onAdd={() => {
              setCategoryEditId(null)
              setTela('formularioCategoria')
            }}
            onEdit={(category) => {
              setCategoryToEdit(category)
              setCategoryEditId(category.id)
              setTela('formularioCategoria')
            }}
            onRemove={(category) => {
              const emUso = budgets.some(b =>
                b.categories.some(c => c.id === category.id)
              )
              if (emUso) {
                setCategoryError(`A categoria "${category.name}" está em uso em um ou mais orçamentos e não pode ser removida.`)
              } else {
                setCategoryToRemove(category)
              }
            }}

          />
        </div>
      )}

      {tela === 'formularioCategoria' && (
        <CategoryForm
          categoryToEdit={categoryToEdit}
          onCancel={() => {
            setCategoryToEdit(null)
            setCategoryEditId(null)
            setTela('categorias')
          }}
          onSave={(newCategories) => {
            if (categoryEditId !== null) {
              updateCategory(categoryEditId, newCategories)
              setCategoryEditId(null)
              setCategoryToEdit(null)
            } else {
              addCategory(newCategories)
            }
            setTela('categorias')
          }}
        />
      )}

      {budgetToRemove && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover orçamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover "{budgetToRemove.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBudgetToRemove(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setBudgets(budgets.filter((_, i) => i !== budgetToRemove.index))
                setBudgetToRemove(null)
              }}>Remover</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {expenseToRemove && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover despesa</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover "{expenseToRemove.description}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExpenseToRemove(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                const budgetAtualizado = deleteExpense(selectedBudgetIndex, expenseToRemove.categoryIndex, expenseToRemove.expenseIndex)
                setSelectedBudget(budgetAtualizado)
                setExpenseToRemove(null)
              }}>Remover</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {categoryToRemove && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover categoria</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover "{categoryToRemove.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToRemove(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                removeCategory(categoryToRemove.id)
                setCategoryToRemove(null)
              }}>Remover</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default App