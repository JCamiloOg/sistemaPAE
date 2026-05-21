import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ButtonHTMLAttributes } from "react";


interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string,
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"],
    icon: IconDefinition,
    color: "green" | "rose" | "gray" | "yellow" | "blue"
    variant?: "default" | "outline" | "semi",
    size?: "sm" | "md"
}

export default function Button({ title, icon, color, variant = "default", size = "md", ...rest }: Props) {

    const colors = {
        green: {
            default: `bg-green-800 text-white hover:-translate-y-0.5 hover:bg-green-900 `,
            outline: `border border-green-300 text-green-800 hover:bg-green-100`,
            semi: `rounded-xl bg-green-50 text-green-600 hover:bg-green-100`
        },
        rose: {
            default: `bg-rose-800 text-white hover:-translate-y-0.5 hover:bg-rose-900 `,
            outline: `border border-rose-300 text-rose-800 hover:bg-rose-100`,
            semi: `rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100`
        },
        gray: {
            default: `bg-gray-800 text-white hover:-translate-y-0.5 hover:bg-gray-900 `,
            outline: `border border-gray-300 text-gray-800 hover:bg-gray-100`,
            semi: `rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100`
        },
        yellow: {
            default: `bg-yellow-800 text-white hover:-translate-y-0.5 hover:bg-yellow-900 `,
            outline: `border border-yellow-300 text-yellow-800 hover:bg-yellow-100`,
            semi: `rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100`
        },
        blue: {
            default: `bg-blue-800 text-white hover:-translate-y-0.5 hover:bg-blue-900 `,
            outline: `border border-blue-300 text-blue-800 hover:bg-blue-100`,
            semi: `rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100`
        }
    };

    const variants = {
        default: `rounded-2xl ${colors[color].default}`,
        outline: `rounded-2xl bg-white ${colors[color].outline}`,
        semi: `rounded-2xl ${colors[color].semi}`
    };


    const sizes = {
        sm: "px-4 py-2",
        md: "px-5 py-3"
    };

    return (
        <button className={`inline-flex cursor-pointer items-center gap-2 transition ${sizes[size]} ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-50`} {...rest}>
            <FontAwesomeIcon icon={icon} />
            {title}
        </button>
    );
}