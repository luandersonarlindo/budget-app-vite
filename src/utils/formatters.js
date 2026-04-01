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

export function maskCurrency(value) {
    const onlyDigits = String(value).replace(/\D/g, '')
    if (!onlyDigits || onlyDigits === '0') return '0,00'
    const number = parseInt(onlyDigits) / 100
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number)
}