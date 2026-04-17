import { findCourseByID } from "../models/courses.model.js";
import { findAllStudents, findStudentByDocument, insertStudent, modifyStudent } from "../models/students.model.js";


export async function getStudents(req, res) {
    try {
        // obtener estudiante por documento
        const { document } = req.params;

        // si existe el documento
        if (document) {
            // obtenemos el estudiante
            const student = await findStudentByDocument(document);

            // si no existe el estudiante
            if (!student) return res.status(404).json({ message: "Documento no encontrado." });

            // devolvemos el estudiante con el status 200
            return res.status(200).json(student);
        }

        // obtenemos todos los estudiantes
        const students = await findAllStudents();

        // devolvemos todos los estudiantes con el status 200
        res.status(200).json(students);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener estudiantes." });
    }
}

export async function createStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        // obtenemos el los datos del body
        const { document, course, name, lastName } = req.body;

        // si el estudiante ya existe
        const student = await findStudentByDocument(document);

        // si el estudiante ya existe
        if (student) return res.status(409).json({ message: "Documento ya registrado." });

        // si el grado no existe
        const courseStudent = await findCourseByID(course);

        if (!courseStudent) return res.status(404).json({ message: "Grado no encontrado." });

        // creamos el estudiante
        const newStudent = {
            documento: document,
            grado: course,
            nombre: name,
            apellido: lastName
        };

        const result = await insertStudent(newStudent);

        // si no se creo el estudiante
        if (!result) return res.status(500).json({ message: "Error al crear estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear estudiante." });

        // devolvemos el estudiante con el status 201
        res.status(201).json({ message: "Estudiante creado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear estudiante." });
    }
}

export async function updateStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        // obtenemos el los datos del body
        const { course, name, lastName, status } = req.body;
        const { document } = req.params;

        // si el estudiante no existe
        const student = await findStudentByDocument(document);

        if (!student) return res.status(404).json({ message: "Documento no encontrado." });

        // si el grado no existe
        const courseStudent = await findCourseByID(course);

        if (!courseStudent) return res.status(404).json({ message: "Grado no encontrado." });

        // actualizamos el estudiante
        const updateStudent = {
            grado: course,
            nombre: name,
            apellido: lastName,
            estado: status
        };

        const result = await modifyStudent(updateStudent, document);

        // si no se actualizo el estudiante
        if (!result) return res.status(500).json({ message: "Error al actualizar estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar estudiante." });

        // devolvemos el estudiante con el status 200
        res.status(200).json({ message: "Estudiante actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar estudiante." });
    }
}

export async function updateStatusStudent(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        // obtenemos el dato del body
        const { status } = req.body;
        const { document } = req.params;

        // si el estado es incorrecto
        if (status !== 'Matriculado' && status !== 'Retirado') return res.status(400).json({ message: "El estado es incorrecto." });

        // si el estudiante no existe
        const student = await findStudentByDocument(document);

        if (!student) return res.status(404).json({ message: "Documento no encontrado." });

        // actualizamos el estudiante
        const updateStudent = {
            estado: status
        };

        // actualizamos el estudiante
        const result = await modifyStudent(updateStudent, document);

        // si no se actualizo el estudiante
        if (!result) return res.status(500).json({ message: "Error al actualizar estudiante." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar estudiante." });

        // devolvemos el estudiante con el status 200
        res.status(200).json({ message: "Estudiante actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar estudiante." });
    }
}