import api from "@/app/api/axios";
import type { Notification, NotificationDB } from "../types/notifications";

export async function fetchNotifications(page: number) {
    return await api.get<{ notifications: NotificationDB[], totalPages: number }>(`/notifications?page=${page}`);
}

export async function fetchNotificationById(id: number) {
    return await api.get<NotificationDB>(`/notifications/${id}`);
}

export async function createNotification(data: Omit<Notification, "id" | "date">) {
    return await api.post<{ message: string }>('/notifications', data);
}

export async function updateNotification(data: Notification) {
    return await api.put<{ message: string }>(`/notifications/${data.id}`, data);
}

export async function updateTypeNotification(id: number, type: string) {
    return await api.put<{ message: string }>(`/notifications/${id}/type`, { type });
}




