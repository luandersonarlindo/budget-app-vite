import { useEffect, useState } from 'react'

function useBusiness() {
    const [periods, setPeriods] = useState(() => {
        const data = localStorage.getItem('businessPeriods')
        return data ? JSON.parse(data) : []
    })

    useEffect(() => {
        localStorage.setItem('businessPeriods', JSON.stringify(periods))
    }, [periods])

    function addPeriod(name) {
        const newPeriod = {
            id: crypto.randomUUID(),
            name,
            incomes: [],
            expenses: []
        }
        setPeriods([...periods, newPeriod])
    }

    function copyPeriod(periodId, newName) {
        const original = periods.find(period => period.id === periodId)
        if (!original) return

        const copia = {
            ...original,
            id: crypto.randomUUID(),
            name: newName || `${original.name} (cópia)`,
            incomes: original.incomes.map(income => ({ ...income, id: crypto.randomUUID() })),
            expenses: original.expenses.map(expense => ({ ...expense, id: crypto.randomUUID() }))
        }

        setPeriods([...periods, copia])
    }

    function updatePeriod(periodId, updatedPeriod) {
        setPeriods(periods.map(period =>
            period.id === periodId
                ? { ...period, ...updatedPeriod, id: period.id }
                : period
        ))
    }

    function removePeriod(periodId) {
        setPeriods(periods.filter(period => period.id !== periodId))
    }

    function addIncome(periodId, income) {
        const newIncome = {
            id: crypto.randomUUID(),
            description: income?.description ?? '',
            value: income?.value ?? 0
        }
        setPeriods(periods.map(period =>
            period.id === periodId
                ? { ...period, incomes: [...period.incomes, newIncome] }
                : period
        ))
    }

    function updateIncome(periodId, incomeId, updatedIncome) {
        setPeriods(periods.map(period =>
            period.id === periodId
                ? {
                    ...period,
                    incomes: period.incomes.map(income =>
                        income.id === incomeId
                            ? { ...income, ...updatedIncome, id: income.id }
                            : income
                    )
                }
                : period
        ))
    }

    function removeIncome(periodId, incomeId) {
        setPeriods(periods.map(period =>
            period.id === periodId
                ? { ...period, incomes: period.incomes.filter(income => income.id !== incomeId) }
                : period
        ))
    }

    function addExpense(periodId, expense) {
        const newExpense = {
            id: crypto.randomUUID(),
            description: expense?.description ?? '',
            value: expense?.value ?? 0
        }
        setPeriods(periods.map(period =>
            period.id === periodId
                ? { ...period, expenses: [...period.expenses, newExpense] }
                : period
        ))
    }

    function updateExpense(periodId, expenseId, updatedExpense) {
        setPeriods(periods.map(period =>
            period.id === periodId
                ? {
                    ...period,
                    expenses: period.expenses.map(expense =>
                        expense.id === expenseId
                            ? { ...expense, ...updatedExpense, id: expense.id }
                            : expense
                    )
                }
                : period
        ))
    }

    function removeExpense(periodId, expenseId) {
        setPeriods(periods.map(period =>
            period.id === periodId
                ? { ...period, expenses: period.expenses.filter(expense => expense.id !== expenseId) }
                : period
        ))
    }

    return {
        periods,
        setPeriods,
        addPeriod,
        copyPeriod,
        updatePeriod,
        removePeriod,
        addIncome,
        updateIncome,
        removeIncome,
        addExpense,
        updateExpense,
        removeExpense
    }
}

export default useBusiness
