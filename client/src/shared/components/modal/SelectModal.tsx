import type { ReactNode, SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: ReactNode,
    // className?: string
}


export default function SelectModal({ label, error, children, ...rest }: Props) {
    return (
        <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-green-700">{label}</span>
            <select className={`w-full rounded-2xl border ${error ? "border-red-200 focus:ring-red-200 focus:border-red-400" : "border-green-200 focus:ring-green-200 focus:border-green-400"}  bg-white px-4 py-3 text-sm text-green-800 outline-none transition disabled:cursor-not-allowed disabled:opacity-50`} {...rest}>
                {children}
            </select>
            {error && <p className="font-medium text-red-500 text-sm">{error}</p>}

        </label>
    );
}