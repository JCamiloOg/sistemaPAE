export interface CourseDB {
    id_grado: number,
    grado: string,
    id_horario: number
    hora_inicio: string,
    hora_fin: string,
    turno: "Mañana" | "Tarde"
}

export interface Course {
    id_course?: number,
    course: string,
    id_schedule?: number,
    start_time: string,
    end_time: string
    turn: string
}