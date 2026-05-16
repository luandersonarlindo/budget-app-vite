import { useEffect, useState } from 'react'

function useBudgets() {
    const [budgets, setBudgets] = useState(() => {
        const data = localStorage.getItem('budgets')
        return data ? JSON.parse(data) : []
    })

    const addBudget = (budget) => {
        setBudgets((prev) => [...prev, budget])
    }

    const updateBudget = (budgetId, budget) => {
        setBudgets((prev) => prev.map((item) => (item.id === budgetId ? budget : item)))
    }

    const removeBudget = (budgetId) => {
        setBudgets((prev) => prev.filter((budget) => budget.id !== budgetId))
    }

    const copyBudget = (budgetId, newName, newValue) => {
        const original = budgets.find((b) => b.id === budgetId)
        if (!original) return

        const copy = {
            ...original,
            id: crypto.randomUUID(),
            name: newName || `${original.name} (cópia)`,
            value: newValue ?? original.value,
            categories: (original.categories || []).map((category) => ({
                ...category,
                expenses: (category.expenses || []).map((expense) => ({
                    ...expense,
                    id: crypto.randomUUID()
                }))
            }))
        }

        setBudgets((prev) => [...prev, copy])
    }

    const addExpense = (budgetId, categoryId, expense) => {
        const expenseToAdd = {
            id: expense?.id || crypto.randomUUID(),
            description: expense?.description ?? '',
            value: Number(expense?.value) || 0,
            status: expense?.status ?? 'pendente'
        }

        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id !== categoryId) return category
                        return {
                            ...category,
                            expenses: [...(category.expenses || []), expenseToAdd]
                        }
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    const updateExpense = (budgetId, categoryId, expenseId, expense) => {
        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id !== categoryId) return category

                        return {
                            ...category,
                            expenses: (category.expenses || []).map((item) => {
                                if (item.id !== expenseId) return item
                                return {
                                    ...item,
                                    ...expense,
                                    id: item.id
                                }
                            })
                        }
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    const removeExpense = (budgetId, categoryId, expenseId) => {
        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id !== categoryId) return category
                        return {
                            ...category,
                            expenses: (category.expenses || []).filter((exp) => exp.id !== expenseId)
                        }
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    const moveExpense = (budgetId, fromCategoryId, expenseId, toCategoryId) => {
        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const fromCategory = budget.categories?.find((c) => c.id === fromCategoryId)
                const expenseToMove = fromCategory?.expenses?.find((e) => e.id === expenseId)
                if (!expenseToMove) return budget

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id === fromCategoryId) {
                            return {
                                ...category,
                                expenses: (category.expenses || []).filter((exp) => exp.id !== expenseId)
                            }
                        }

                        if (category.id === toCategoryId) {
                            return {
                                ...category,
                                expenses: [...(category.expenses || []), expenseToMove]
                            }
                        }

                        return category
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    const moveAndUpdateExpense = (budgetId, fromCategoryId, expenseId, toCategoryId, expense) => {
        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const fromCategory = budget.categories?.find((c) => c.id === fromCategoryId)
                const currentExpense = fromCategory?.expenses?.find((e) => e.id === expenseId)
                if (!currentExpense) return budget

                const updatedExpense = {
                    ...currentExpense,
                    ...expense,
                    id: currentExpense.id
                }

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id === fromCategoryId) {
                            return {
                                ...category,
                                expenses: (category.expenses || []).filter((exp) => exp.id !== expenseId)
                            }
                        }

                        if (category.id === toCategoryId) {
                            return {
                                ...category,
                                expenses: [...(category.expenses || []), updatedExpense]
                            }
                        }

                        return category
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    const updateExpenseStatus = (budgetId, categoryId, expenseId, status) => {
        let updatedBudget = null
        setBudgets((prev) => {
            const next = prev.map((budget) => {
                if (budget.id !== budgetId) return budget

                const nextBudget = {
                    ...budget,
                    categories: (budget.categories || []).map((category) => {
                        if (category.id !== categoryId) return category

                        return {
                            ...category,
                            expenses: (category.expenses || []).map((item) => {
                                if (item.id !== expenseId) return item
                                return { ...item, status }
                            })
                        }
                    })
                }

                updatedBudget = nextBudget
                return nextBudget
            })

            return next
        })

        return updatedBudget
    }

    useEffect(() => {
        localStorage.setItem('budgets', JSON.stringify(budgets))
    }, [budgets])

    return {
        budgets,
        setBudgets,
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
    }
}

export default useBudgets
