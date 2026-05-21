import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode,
};

export default function Table({ children }: Props) {
    return (
        <div className="flex-1 p-6 ">
            <section className="glass-card rounded-4xl bg-[#faf8f5e0]  border border-white/60 p-6 shadow-soft" data-aos="fade-up">
                {children}
            </section>
        </div>
    );
}


Table.Header = ({ title, description, action }: { title: string, description: string, action: ReactNode }) => {
    return <div className="flex justify-between flex-wrap space-y-5">
        <div className="font-mono">
            <p>{title}</p>
            <p className="text-xs text-green-500">{description}</p>
        </div>
        <div className="mb-6 flex ">
            {action}
        </div>
    </div>;
};

Table.Table = ({ children }: { children: ReactNode }) => {
    return <div className="table-scroll overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
            {children}
        </table>
    </div>;
};

Table.Thead = ({ children }: { children: ReactNode }) => {
    return <thead>{children}</thead>;
};

Table.Row = ({ head, children }: { children: ReactNode, head?: boolean }) => {
    if (head) return <tr className="text-left text-xs uppercase tracking-[0.18em] text-green-500">{children}</tr>;

    return <tr className="rounded-3xl bg-white/85 shadow-sm">{children}</tr>;
};

Table.Cell = ({ children, rounded, className, colSpan }: { children: ReactNode, rounded?: "none" | "left" | "right" | "full", head?: boolean, className?: string, colSpan?: number }) => {
    const classes = {
        none: "px-4 py-4",
        left: "px-4 py-4 rounded-l-3xl",
        right: "px-4 py-4 rounded-r-3xl",
        full: "px-4 py-4 rounded-3xl",
    };

    return <td colSpan={colSpan} className={`${classes[rounded || "none"]} ${className}`}>{children}</td>;
};

Table.Tbody = ({ children }: { children: ReactNode }) => {
    return <tbody className="text-sm text-green-800">{children}</tbody>;
};


Table.Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            {/* Info */}
            <p className="text-xs text-green-500 ">
                Página {currentPage} de {totalPages}
            </p>

            {/* Controles */}
            <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || totalPages === 1}
                    className="px-3 py-2 rounded-2xl bg-white/70 border border-white/60 shadow-soft text-sm disabled:opacity-40 hover:bg-white transition cursor-pointer disabled:cursor-default"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                {/* Números */}
                {pages.map((page) => {
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-2xl text-sm transition cursor-pointer
                ${isActive
                                    ? "bg-green-600 text-white shadow-soft"
                                    : "bg-white/70 border border-white/60 hover:bg-white"
                                }
              `}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 1}
                    className="px-3 py-2 rounded-2xl bg-white/70 border cursor-pointer border-white/60 shadow-soft text-sm disabled:opacity-40 hover:bg-white transition disabled:cursor-default"
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    );
};