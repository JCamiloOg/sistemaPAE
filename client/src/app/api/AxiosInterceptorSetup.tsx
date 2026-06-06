import { useUser } from "@/shared/hooks/useUser";
import { useEffect } from "react";
import api from "./axios";

export default function AxiosInterceptorSetup() {
    const { setUser } = useUser();

    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => {
                setUser(response.data.user);
                return response;
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [setUser]);

    return null;
}