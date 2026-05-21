import { useContext } from "react";
import LoaderContext from "../context/loader.context";

export const usePageLoader = () => {
    const context = useContext(LoaderContext);

    if (!context) {
        throw new Error("usePageLoader must be used within LoaderProvider");
    }

    return context;
};