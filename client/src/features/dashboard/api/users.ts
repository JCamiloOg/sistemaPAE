import api from "@/app/api/axios";
import type { Roles, User, UserDB } from "../types/users";

// export async function registerUser() {
//     return await api.post<{ message: string }>("/users", user);
// }

export async function getAllUsers(page: number) {
    return await api.get<{ users: UserDB[], roles: Roles[], totalPages: number }>(`/users?page=${page}`);
}

export async function getUserById(id: number) {
    return await api.get<{ user: User }>(`/users/${id}`);
}

export async function insertUser(user: User) {
    return await api.post<{ message: string }>("/users", user);
}

export async function updateUser(user: User) {
    return await api.put<{ message: string }>(`/users/${user.document}`, user);
}

export async function changeUserStatus(id: string, status: 0 | 1) {
    return await api.put<{ message: string }>(`/users/status/${id}`, { status });
}