import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from './ui/pagination'

function getPageNumbers(current, total) {
    const pages = []
    const delta = 1

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            pages.push(i)
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...')
        }
    }
    return pages
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const pages = getPageNumbers(currentPage, totalPages)

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) onPageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {pages.map((page, i) =>
                    page === '...' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(page)
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) onPageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationControls