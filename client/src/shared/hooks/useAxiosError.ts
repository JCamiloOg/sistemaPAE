import { isAxiosError } from "axios";
import { Toast } from "../ui/alerts";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export default function useAxiosError() {


    const navigate = useNavigate();

    const handleError = useCallback((error: unknown) => {

        if (!isAxiosError<{ message?: string }>(error)) {
            return Toast.fire({
                icon: "error",
                title: "Error desconocido del servidor",
            });
        }

        if (error.code === "ERR_NETWORK") {
            return Toast.fire({
                icon: "question",
                title: "Error de conexión, intente nuevamente.",
            });
        }

        if (error.status === 401) {
            navigate({ to: "/" });

            return Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "No autorizado.",
            });
        }

        return Toast.fire({
            icon: "error",
            title: error.response?.data?.message || error.message || "Error desconocido del servidor.",
        });
    }, [navigate]);

    return { handleError };
}