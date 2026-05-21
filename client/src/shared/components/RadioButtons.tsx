import type { ReactNode } from "react";

type Option<T> = {
    label: string;
    value: T;
    icon?: ReactNode;
};

interface Props<T> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
}

export default function GlassRadioGroup<T extends string>({
    value,
    onChange,
    options,
}: Props<T>) {
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((opt) => {
                const active = opt.value === value;

                return (
                    <button
                        type="button"
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl text-sm transition
              border backdrop-blur-md cursor-pointer
              ${active
                                ? "bg-green-600 text-white border-green-600 shadow-soft"
                                : "bg-white/60 border-white/60 text-green-800 hover:bg-white/80"}
            `}
                    >
                        {/* Indicador tipo radio */}
                        <span
                            className={`
                w-3 h-3 rounded-full border flex items-center justify-center
                ${active ? "border-white" : "border-green-400"}
              `}
                        >
                            {active && (
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </span>

                        {opt.icon}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}