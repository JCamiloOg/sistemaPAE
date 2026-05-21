import type { Student, StudentDB, StudentStatus } from "@/features/dashboard/types/assistance";
import type { CourseDB } from "../types/course";
import api from "@/app/api/axios";

export async function getStudents(page?: number, course?: number) {
    return await api.get<{ students: StudentDB[], totalPages: number, courses: CourseDB[] }>(`/students?${course ? `course=${course}` : ""}${page ? `&page=${page}` : ""}`);
}

export async function getStudentsByCourse(id: number, date: string) {
    return await api.get<{ message?: string, students: StudentDB[] }>(`/assistance?course=${id}&date=${date}`);
}

export async function insertStudent(student: Omit<Student, "status">) {
    return await api.post<{ message: string }>(`/students`, student);
}

export async function updateStudent(student: Omit<Student, "status">) {
    return await api.put<{ message: string }>(`/students/${student.document}`, student);
}

export async function updateStatusStudent(document: string, status: StudentStatus) {
    return await api.put<{ message: string }>(`/students/status/${document}`, { status });
}
