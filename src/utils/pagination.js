export function paginateLIFO(items, currentPage, pageSize) {
    const sorted = [...items].reverse()
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * pageSize
    const pageItems = sorted.slice(start, start + pageSize)

    return { pageItems, totalPages, safePage }
}