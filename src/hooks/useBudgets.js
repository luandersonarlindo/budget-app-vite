import { useEffect, useState } from 'react'

function useBudgets() {
    const [budgets, setBudgets] = useState(() => {
        const data = localStorage.getItem('budgets')
        return data ? JSON.parse(data) : []
    })

    useEffect(() => {
        localStorage.setItem('budgets', JSON.stringify(budgets))
    }, [budgets])

    function copyBudget(budgetIndex, novoNome, novoValor) {
        const original = budgets[budgetIndex]
        const copia = {
            ...original,
            name: novoNome,
            value: novoValor,
            categories: original.categories.map(cat => ({
                ...cat,
                expenses: [...cat.expenses]
            }))
        }
        const novosBudgets = [...budgets, copia]
        setBudgets(novosBudgets)
    }

    return { budgets, setBudgets, copyBudget }
}

export default useBudgets