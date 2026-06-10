import { useUser } from "@/shared/hooks/useUser";
import { useEffect } from "react";
import api from "./axios";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../env";

export default function AxiosInterceptorSetup() {
    const { setUser, accessToken, setAccessToken } = useUser();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            }
        );


        const responseInterceptor = api.interceptors.response.use(
            (response) => {
                setUser(response.data.user);
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const { data } = await axios.post<{ accessToken: string }>(`${API_URL}/refresh`, {}, { withCredentials: true });

                        setAccessToken(data.accessToken);

                        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                        return api(originalRequest);

                    } catch (err) {
                        if (isAxiosError(err)) {
                            setAccessToken(null);
                            setUser(null);
                            return Promise.reject(err);
                        }
                    }
                }
                if (isAxiosError(error)) {
                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, setAccessToken, setUser]);

    return null;
}