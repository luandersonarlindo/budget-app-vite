export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function parseUserValue(valueStr) {
    const cleaned = String(valueStr).replace(/\./g, '').replace(',', '.')
    return parseFloat(cleaned)
}