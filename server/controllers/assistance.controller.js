import { findAllAssistanceByDateAndCourse, insertAssistance, modifyAssistance } from "../models/assistance.model.js";
import { findCourseByID } from "../models/courses.model.js";
import { findStudentByCourse, findStudentByDocument } from "../models/students.model.js";
import { sqlDateFormat, sqlTimeFormat } from "../utils/formatDate.js";

export async function getAssistance(req, res) {
    try {

        const { date, course } = req.query;

        if (!course) return res.status(404).json({ message: "No se recibieron datos." });

        const groupExist = await findCourseByID(course);

        if (!groupExist) return res.status(404).json({ message: "Grado no encontrado." });

        const assistanceExist = await findAllAssistanceByDateAndCourse(course, date ? date : sqlDateFormat(new Date()));

        if (assistanceExist.length > 0) {
            if (date == sqlDateFormat(new Date()) || !date) return res.status(200).json({ message: "Ya se ha registrado la asistencia el día de hoy.", students: assistanceExist });

            return res.status(200).json({ message: "Asistencia obtenida exitosamente.", students: assistanceExist });
        } else {
            if (date && date < sqlDateFormat(new Date())) return res.status(404).json({ message: `No se ha registrado la asistencia el día ${Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))}.` });


            const students = await findStudentByCourse(course);

            res.status(200).json({ students });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener asistencia." });
    }
}


export async function saveAssistance(req, res) {
    try {

        const { assistance } = req.body;

        if (!assistance) return res.status(400).json({ message: "No se recibieron datos." });

        let notFoundStudents = [];

        for (const student of assistance) {

            const studentExist = await findStudentByDocument(student.documento);

            if (!studentExist) {
                notFoundStudents.push({ documento: student.documento, nombre: student.nombre, apellido: student.apellido });
                continue;
            }

            const newAssistance = {
                id_estudiante: student.documento,
                estado: student.estado ? 'Asistió' : 'No asistió',
                fecha: sqlDateFormat(new Date()),
                hora_ingreso: sqlTimeFormat(new Date()),
            };

            await insertAssistance(newAssistance);
        }

        if (notFoundStudents.length > 0) return res.status(200).json({ message: "Asistencia guardada exitosamente. No se han encontrado estos estudiantes, por favor verifique el documento.", notFoundStudents });
        else return res.status(200).json({ message: "Asistencia guardada exitosamente." });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al guardar asistencia." });
    }
}


export async function updateAssistance(req, res) {
    try {

        const { assistance } = req.body;


        if (!assistance) return res.status(400).json({ message: "No se recibieron datos." });

        for (const student of assistance) {

            const newAssistance = {
                id_estudiante: student.documento,
                estado: student.estado ? 'Asistió' : 'No asistió',
            };
            await modifyAssistance(newAssistance, student.id_asistencia);
        }

        return res.status(200).json({ message: "Asistencia actualizada exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar asistencia." });
    }
}