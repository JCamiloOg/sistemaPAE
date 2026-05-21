interface Props {
    title: string,
    type: "primary" | "secondary" | "danger" | "warning"
}

export default function Badge({ title, type = "primary" }: Props) {
    const colors = {
        primary: "bg-emerald-100 text-emerald-800",
        secondary: "bg-gray-100 text-gray-800",
        danger: "bg-red-100 text-red-800",
        warning: "bg-yellow-100 text-yellow-800"
    };

    return (
        <span className={`inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium ${colors[type]}`}>{title}</span>
    );
}