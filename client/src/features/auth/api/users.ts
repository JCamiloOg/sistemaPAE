import api from "@/app/api/axios";


export async function loginUser(user: { document: string, password: string }) {
    return await api.post<{ errors: { field: string, message: string }, message: string, redirect: string }>("/", user);
}

export async function verifyToken() {
    return await api.get<{ message?: string, redirect?: string }>("/");
}

export async function logout() {
    return await api.post<{ message: string }>("/logout");
}


