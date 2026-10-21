import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationEllipsis, PaginationLink, PaginationNext } from "./pagination";
import type { PageInfo } from "@khinemyaezin/seller-api";

function generatePagination(currentPage: number, totalPages: number) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (currentPage <= 2) {
        return [0, 1, 2, "...", totalPages - 1];
    }
    if (currentPage >= totalPages - 3) {
        return [0, "...", totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [0, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1];
}

export function Pager({ className, onPageChange, ...pageInfo }: PageInfo & { className: string, onPageChange?: (newPage: number) => void }) {
    const { number: page, totalPages } = pageInfo;
    const pages = generatePagination(page, totalPages);

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        text=""
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange?.(page - 1);
                        }}
                        aria-disabled={page === 0}
                        className={page === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {pages.map((p, i) => (
                    <PaginationItem key={i}>
                        {p === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange?.(p as number);
                                }}
                            >
                                {(p as number) + 1}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        text=""
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange?.(page + 1);
                        }}
                        aria-disabled={page === totalPages - 1}
                        className={page === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
