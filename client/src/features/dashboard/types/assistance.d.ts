export interface StudentDB {
    documento: string;
    nombre: string;
    apellido: string;
    grado: string;
    estado: "Matriculado" | "Retirado" | "Cancelado";
    asistencia?: string;
    id_asistencia?: number;
    fecha?: string;
    hora_ingreso?: string;
    id_grado: string;
}

export interface Student {
    document: string;
    name: string;
    lastName: string;
    course: string;
    status: "Matriculado" | "Retirado" | "Cancelado";
}

export type InsertStudent = Omit<StudentDB, "status">;

export type UpdateStudent = Student;

export interface Assistance {
    documento: string;
    estado: boolean;
    id_assistance?: number;
}

export type StudentStatus = "Matriculado" | "Retirado" | "Cancelado";