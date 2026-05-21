import api from "@/app/api/axios";


export async function createAssistance(assistance: { documento: string, estado: boolean }[]) {
    return await api.post<{ message: string, notFoundStudents?: { documento: string, nombre: string, apellido: string } }>("/assistance", { assistance });
}


export async function updateAssistance(assistance: { documento: string, estado: boolean }[]) {
    return await api.put<{ message: string }>("/assistance", { assistance });
}

