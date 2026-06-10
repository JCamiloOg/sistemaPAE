import api from "@/app/api/axios";
import type { LoggedUser } from "@/features/dashboard/types/users";


export async function loginUser(user: { document: string, password: string }) {
    return await api.post<{ message: string, redirect: string, user: LoggedUser, accessToken: string }>("/", user);
}

export async function verifyToken() {
    return await api.get<{ message?: string, redirect?: string, notFound?: boolean }>("/");
}

export async function logout() {
    return await api.post<{ message: string }>("/logout");
}


