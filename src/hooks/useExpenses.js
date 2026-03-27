function useExpenses(budgets, setBudgets) {

    function addExpense(budgetIndex, categoryIndex, expense) {
        const novosBudgets = budgets.map((b, i) => {
            if (i !== budgetIndex) return b
            return {
                ...b,
                categories: b.categories.map((cat, ci) => {
                    if (ci !== categoryIndex) return cat
                    return { ...cat, expenses: [...cat.expenses, expense] }
                })
            }
        })
        setBudgets(novosBudgets)
        return novosBudgets[budgetIndex]
    }

    function updateExpense(budgetIndex, categoryIndex, expenseIndex, expense) {
        const novosBudgets = budgets.map((b, i) => {
            if (i !== budgetIndex) return b
            return {
                ...b,
                categories: b.categories.map((cat, ci) => {
                    if (ci !== categoryIndex) return cat
                    return {
                        ...cat,
                        expenses: cat.expenses.map((exp, ei) =>
                            ei === expenseIndex ? expense : exp
                        )
                    }
                })
            }
        })
        setBudgets(novosBudgets)
        return novosBudgets[budgetIndex]
    }

    function deleteExpense(budgetIndex, categoryIndex, expenseIndex) {
        const novosBudgets = budgets.map((b, i) => {
            if (i !== budgetIndex) return b
            return {
                ...b,
                categories: b.categories.map((cat, ci) => {
                    if (ci !== categoryIndex) return cat
                    return {
                        ...cat,
                        expenses: cat.expenses.filter((_, ei) => ei !== expenseIndex)
                    }
                })
            }
        })
        setBudgets(novosBudgets)
        return novosBudgets[budgetIndex]
    }

    function moveExpense(budgetIndex, fromCategoryIndex, expenseIndex, toCategoryIndex) {
        const novosBudgets = budgets.map((b, i) => {
            if (i !== budgetIndex) return b
            const expense = b.categories[fromCategoryIndex].expenses[expenseIndex]
            return {
                ...b,
                categories: b.categories.map((cat, ci) => {
                    if (ci === fromCategoryIndex) {
                        return { ...cat, expenses: cat.expenses.filter((_, ei) => ei !== expenseIndex) }
                    }
                    if (ci === toCategoryIndex) {
                        return { ...cat, expenses: [...cat.expenses, expense] }
                    }
                    return cat
                })
            }
        })
        setBudgets(novosBudgets)
        return novosBudgets[budgetIndex]
    }

    function moveAndUpdateExpense(budgetIndex, fromCategoryIndex, expenseIndex, toCategoryIndex, expense) {
        const novosBudgets = budgets.map((b, i) => {
            if (i !== budgetIndex) return b
            return {
                ...b,
                categories: b.categories.map((cat, ci) => {
                    if (ci === fromCategoryIndex) {
                        return { ...cat, expenses: cat.expenses.filter((_, ei) => ei !== expenseIndex) }
                    }
                    if (ci === toCategoryIndex) {
                        return { ...cat, expenses: [...cat.expenses, expense] }
                    }
                    return cat
                })
            }
        })
        setBudgets(novosBudgets)
        return novosBudgets[budgetIndex]
    }

    return { addExpense, updateExpense, deleteExpense, moveExpense, moveAndUpdateExpense }
}

export default useExpenses