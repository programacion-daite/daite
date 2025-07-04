import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious } from '@/components/ui/pagination';

interface PaginationSectionProps {
    handlePageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
}

export function PaginationSection({ currentPage, handlePageChange, totalPages }: PaginationSectionProps) {
    const handlePreviousClick = currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1);

    return (
        <>
            <PaginationContent>
                <Pagination className="flex items-center space-x-1 font-medium text-gray-700 outline-none">
                    <PaginationPrevious
                        onClick={handlePreviousClick}
                        aria-disabled={currentPage === 1}
                        className={`rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none outline-none${
                            currentPage === 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-gray-200'
                        }`}
                    >
                        ‹
                    </PaginationPrevious>

                    {[...Array(totalPages).keys()].map((page) => {
                        const isActive = currentPage === page + 1;
                        return (
                            <PaginationItem key={page + 1}>
                                <PaginationLink
                                    onClick={() => handlePageChange(page + 1)}
                                    isActive={isActive}
                                    aria-current={isActive ? 'page' : undefined}
                                    tabIndex={isActive ? -1 : 0}
                                    className={`rounded-md px-3 py-1 transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                                        isActive ? 'bg-blue-600 text-white' : 'cursor-pointer hover:bg-gray-100'
                                    }`}
                                >
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </Pagination>
            </PaginationContent>
        </>
    );
}
