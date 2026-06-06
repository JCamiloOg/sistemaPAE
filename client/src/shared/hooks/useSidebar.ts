import { useCallback, useState } from "react";

export default function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const openSidebar = useCallback(() => setIsOpen(true), []);
    const closeSidebar = useCallback(() => setIsOpen(false), []);

    return { isOpen, toggleSidebar, openSidebar, closeSidebar };
}