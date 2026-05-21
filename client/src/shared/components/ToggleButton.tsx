import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    active: boolean
}

export default function ToggleButton({ active, ...rest }: Props) {
    return (
        <button
            className={`relative w-14 h-7 flex items-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 cursor-pointer
                        ${active ? "bg-green-600" : "bg-green-200"}`}
            {...rest}
        >
            <span
                className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300
                          ${active
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
            />
        </button>
    );
}