import api from "@/app/api/axios";
import type { Course, CourseDB } from "../types/course";


export async function getAllCoursesAndSchedules(page?: number) {
    return await api.get<{ courses: CourseDB[], totalPages?: number }>(`/courses${page ? `?page=${page}` : ""}`);
}

export async function getAllCourses() {
    return await api.get<{ courses: CourseDB[] }>(`/courses/all`);
}


export async function insertCourse(data: Course) {
    return await api.post<{ message: string }>(`/courses`, data);
}

export async function updateCourse(data: Course) {
    return await api.put<{ message: string }>(`/courses/${data.id_course}`, data);
}


export async function deleteCourse(id: number) {
    return await api.delete<{ message: string }>(`/courses/${id}`);
}

