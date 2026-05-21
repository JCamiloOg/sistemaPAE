export interface StudentsWithMoresOffenses {
    documento: string;
    nombreCompleto: string;
    grado: string;
    total: number
}

export interface AssistanceForWeek {
    dia: string;
    semana_actual: number,
    semana_pasada: number
}

export interface UpcomingDistribution {
    id_grado: number;
    grado: string;
    hora_inicio: string;
    hora_fin: string
    estado: "En curso" | "Próximo"
}

export interface NotificationForWeek {
    titulo: string,
    mensaje: string,
    fecha: string,
    tipo: "Urgente" | "Información" | "General",
    usuario: string,
    documento: string
}

export interface LastIngresedStudents {
    documento: string;
    nombreCompleto: string;
    grado: string;
    create_at: string;
}