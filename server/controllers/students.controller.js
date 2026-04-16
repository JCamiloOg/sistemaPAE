import { findCourseByID } from "../models/courses.model.js";
import { findAllStudents, findStudentByDocument, insertStudent, modifyStudent } from "../models/students.model.js";


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

export async function createStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { document, course, name, lastName } = req.body;

        const student = await findStudentByDocument(document);

        if (student) return res.status(409).json({ message: "Documento ya registrado." });

        const courseStudent = await findCourseByID(course);

        if (!courseStudent) return res.status(404).json({ message: "Grado no encontrado." });

        const newStudent = {
            documento: document,
            grado: course,
            nombre: name,
            apellido: lastName
        };

        const result = await insertStudent(newStudent);

        if (!result) return res.status(500).json({ message: "Error al crear estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear estudiante." });

        res.status(201).json({ message: "Estudiante creado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear estudiante." });
    }
}

export async function updateStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { course, name, lastName, status } = req.body;
        const { document } = req.params;

        const student = await findStudentByDocument(document);

        if (!student) return res.status(404).json({ message: "Documento no encontrado." });

        const updateStudent = {
            grado: course,
            nombre: name,
            apellido: lastName,
            estado: status
        };

        const result = await modifyStudent(updateStudent, document);

        if (!result) return res.status(500).json({ message: "Error al actualizar estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar estudiante." });

        res.status(200).json({ message: "Estudiante actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar estudiante." });
    }
}

export async function updateStatusStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { status } = req.body;
        const { document } = req.params;

        if (status !== 'Matriculado' && status !== 'Retirado') return res.status(400).json({ message: "El estado es incorrecto." });

        const student = await findStudentByDocument(document);

        if (!student) return res.status(404).json({ message: "Documento no encontrado." });

        const updateStudent = {
            estado: status
        };

        const result = await modifyStudent(updateStudent, document);

        if (!result) return res.status(500).json({ message: "Error al actualizar estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar estudiante." });

        res.status(200).json({ message: "Estudiante actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar estudiante." });
    }
}