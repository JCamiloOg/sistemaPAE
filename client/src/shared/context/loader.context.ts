import { createContext } from "react";

type LoaderContextType = {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);


export default LoaderContext;
