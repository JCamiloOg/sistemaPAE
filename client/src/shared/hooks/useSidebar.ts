import { useCallback, useState } from "react";

export default function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    return { isOpen, toggleSidebar };
}