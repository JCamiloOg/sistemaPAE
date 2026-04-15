import { findAllStudents, findStudentByDocument } from "../models/students.model";


export async function getStudents(req, res) {
    try {
        const { document } = req.params;

        if (document) {
            const student = await findStudentByDocument(document);

            if (!student) return res.status(404).json({ message: "Documento no encontrado." });

            return res.status(200).json(student);
        }

        const students = await findAllStudents();

        res.status(200).json(students);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener estudiantes." });
    }
}