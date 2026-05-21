import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    placeholder?: string,
    error?: string,
    col?: "col2" | "col1"
}

export default function InputModal({ label, placeholder, error, col = "col1", ...rest }: Props) {
    const colClass = col === "col2" ? "md:col-span-2" : "md:col-span-1";

    return (
        <>
            <label className={`block ${colClass}`}>
                <span className="mb-2 block text-sm font-medium text-green-700">{label}</span>
                <input
                    placeholder={placeholder}
                    className={`w-full rounded-2xl border ${error ? "border-red-200 focus:ring-red-200 focus:border-red-400" : "border-green-200 focus:ring-green-200 focus:border-green-400"}  bg-white px-4 py-3 text-sm text-green-800 outline-none transition  focus:ring-2 `}
                    {...rest} />
                {error && <p className="font-medium text-red-500 text-sm mt-2">{error}</p>}
            </label>
        </>
    );
}