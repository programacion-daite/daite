import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious } from '@/components/ui/pagination';
import usePagination from '@/hooks/table/use-pagination';
interface PaginationSectionProps {
    handlePageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
}

export function PaginationSection({ currentPage, handlePageChange, totalPages }: PaginationSectionProps) {
    const handlePreviousClick = currentPage > 1 ? () => handlePageChange(currentPage - 1) : undefined;

    const pages = usePagination(currentPage, totalPages);

    return (
        <PaginationContent>
            <Pagination className="flex items-center space-x-1 font-medium text-gray-700 outline-none">
                <PaginationPrevious
                    onClick={handlePreviousClick}
                    aria-disabled={currentPage === 1}
                    className={`rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                        currentPage === 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-gray-200'
                    }`}
                >
                    ‹
                </PaginationPrevious>

                {pages.map((page, idx) =>
                    page === '...' ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <span className="px-3 py-1">...</span>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={() => handlePageChange(Number(page))}
                                isActive={currentPage === page}
                                aria-current={currentPage === page ? 'page' : undefined}
                                tabIndex={currentPage === page ? -1 : 0}
                                className={`rounded-md px-3 py-1 transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                                    currentPage === page ? 'bg-blue-600 text-white' : 'cursor-pointer hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}
            </Pagination>
        </PaginationContent>
    );
}
