import api from "@/app/api/axios";
import type { AssistanceForWeek, LastIngresedStudents, NotificationForWeek, StudentsWithMoresOffenses, UpcomingDistribution } from "../types/dashboard";

interface GetDashboardResponse {
    totalStudents: number;
    totalAssistanceToday: number;
    totalUsers: number;
    totalOffensesToday: number;
    studentsWithMoresOffenses: StudentsWithMoresOffenses[];
    assistanceForWeek: AssistanceForWeek[];
    upcomingDistribution: UpcomingDistribution[];
    notificationsForWeek: NotificationForWeek[];
    lastIngresedStudents: LastIngresedStudents[];
}

export async function getDashboard() {
    return api.get<GetDashboardResponse>('/dashboard');
}