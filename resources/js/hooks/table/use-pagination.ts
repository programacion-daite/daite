export default function usePagination(currentPage: number, totalPages: number) {
    const delta = 2;
    const range: (number | string)[] = [];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) {
        range.push('...');
    }

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < totalPages - 1) {
        range.push('...');
    }

    if (totalPages > 1) {
        range.push(totalPages);
    }

    return range;
}
