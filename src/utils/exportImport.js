export function exportJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function exportCSVBudgets(budgets, filename) {
    const rows = [
        ['orcamento', 'valor_orcamento', 'categoria', 'percentual_categoria', 'despesa', 'valor_despesa', 'status']
    ]

    budgets.forEach(budget => {
        (budget.categories || []).forEach(category => {
            if ((category.expenses || []).length === 0) {
                rows.push([budget.name, budget.value, category.name, category.percent, '', '', ''])
            } else {
                category.expenses.forEach(expense => {
                    rows.push([
                        budget.name,
                        budget.value,
                        category.name,
                        category.percent,
                        expense.description,
                        expense.value,
                        expense.status || 'pendente'
                    ])
                })
            }
        })
    })

    downloadCSV(rows, filename)
}

export function exportCSVBusiness(periods, filename) {
    const rows = [
        ['periodo', 'tipo', 'descricao', 'valor']
    ]

    periods.forEach(period => {
        (period.incomes || []).forEach(income => {
            rows.push([period.name, 'receita', income.description, income.value])
        })
            ; (period.expenses || []).forEach(expense => {
                rows.push([period.name, 'despesa', expense.description, expense.value])
            })
    })

    downloadCSV(rows, filename)
}

function downloadCSV(rows, filename) {
    const csv = rows.map(row =>
        row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function importJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)
                resolve(data)
            } catch {
                reject(new Error('Arquivo JSON inválido'))
            }
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsText(file)
    })
}