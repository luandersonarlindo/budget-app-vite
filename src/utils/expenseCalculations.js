/**
 * Regra central de quais despesas entram no cálculo de "gasto".
 * Despesas com status 'nao_pago' (Cancelado) são ignoradas.
 * 'pendente' e 'pago' contam normalmente.
 */
export function isExpenseCounted(expense) {
    return expense.status !== 'nao_pago'
}

/**
 * Soma o valor das despesas "ativas" (não canceladas) de uma lista.
 */
export function calculateTotalSpent(expenses) {
    return (expenses || [])
        .filter(isExpenseCounted)
        .reduce((acc, exp) => acc + (Number(exp.value) || 0), 0)
}