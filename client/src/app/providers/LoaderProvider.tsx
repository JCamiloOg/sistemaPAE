import LoaderContext from "@/shared/context/loader.context";
import { useState, useCallback } from "react";


export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    const startLoading = useCallback(() => {
        setLoading(true);
        document.body.style.overflow = "hidden";
    }, []);

    const stopLoading = useCallback(() => {
        setLoading(false);
        document.body.style.overflow = "unset";
    }, []);

    return (
        <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};