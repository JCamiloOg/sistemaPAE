import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string,
    placeholder?: string,
    error?: string,
}

export default function Input({ label, placeholder, error, ...rest }: Props) {
    return (
        <>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <input
                placeholder={placeholder}
                className={`w-full px-4 py-2 border ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"} rounded-lg focus:outline-none focus:ring-2  focus:border-transparent transition `}
                {...rest}
            />

            {error && <p className="text-red-500 text-sm font-bold mt-1">{error}</p>}
        </>
    );
}