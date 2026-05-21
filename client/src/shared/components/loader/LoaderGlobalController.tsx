import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { usePageLoader } from "../../hooks/usePageLoader";

export const GlobalLoaderController = () => {
    const { startLoading, stopLoading } = usePageLoader();
    const { location } = useRouterState();

    const prevBaseRef = useRef<string | null>(null);

    useEffect(() => {
        const segments = location.pathname.split("/").filter(Boolean);
        const currentBase = segments[1] ?? "root";

        const isBaseChange = prevBaseRef.current && prevBaseRef.current !== currentBase;

        if (isBaseChange) {
            startLoading();

            // Simulación mínima para UX (puedes ajustar)
            const timeout = setTimeout(() => stopLoading(), 300);

            prevBaseRef.current = currentBase;

            return () => clearTimeout(timeout);
        }


        prevBaseRef.current = currentBase;
    }, [location.pathname, startLoading, stopLoading]);

    return null;
};