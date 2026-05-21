export function sqlDateFormat(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
}

export function sqlTimeFormat(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export function diffDate(date: Date, time: string | Date, reverse: boolean = false, string?: boolean) {
    let diff = 0;

    if (typeof time === "string") {
        diff = new Date(`${sqlDateFormat(date)} ${time}`).getTime() - date.getTime();
    } else {
        diff = time.getTime() - date.getTime();
    }

    diff = reverse ? diff : -diff;

    const diffMinutes = Math.round(diff / 60000);

    if (diffMinutes <= 60) {
        if (string) return `Hace ${diffMinutes} minutos`;
        else return { type: "M", value: diffMinutes };
    }

    const diffHours = Math.round(diffMinutes / 60);

    if (diffHours <= 24) {
        if (string) return `Hace ${diffHours == 1 ? "1 hora" : diffHours + " horas"}`;
        else return { type: "H", value: diffHours };
    }

    const diffDay = Math.round(diffHours / 24);

    if (string) return `Hace ${diffDay == 1 ? "1 día" : diffDay + " días"}`;
    else return { type: "D", value: diffDay };
}