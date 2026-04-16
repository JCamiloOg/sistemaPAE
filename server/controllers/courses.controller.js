import { findAllCourses, findCourseByID, findCourseByName, insertCourse, modifyCourse, removeCourse } from "../models/courses.model.js";

export async function getCourses(req, res) {
    try {
        const { id } = req.params;
        if (id) {
            const course = await findCourseByID(id);
            return res.status(200).json(course);
        }

        const courses = await findAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener el grado." });
    }
}


export async function createCourse(req, res) {
    try {
        const { course } = req.body;

        const courseExist = await findCourseByName(course);

        if (courseExist) return res.status(409).json({ message: "Grado ya registrado." });

        const result = await insertCourse({ grado: course });

        if (!result) return res.status(500).json({ message: "Error al crear el grado." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear el grado." });

        res.status(201).json({ message: "Grado creado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear el grado." });
    }
}

export async function updateCourse(req, res) {
    try {
        const { course } = req.body;
        const { id } = req.params;

        const courseExist = await findCourseByID(id);

        if (!courseExist) return res.status(404).json({ message: "Grado no encontrado." });

        const repeatCourse = await findCourseByName(course);

        if (repeatCourse) return res.status(409).json({ message: "Grado ya registrado." });

        const result = await modifyCourse({ grado: course }, id);

        if (!result) return res.status(500).json({ message: "Error al actualizar el grado." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar el grado." });

        res.status(200).json({ message: "Grado actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar el grado." });
    }
}

export async function deleteCourse(req, res) {
    try {
        const { id } = req.params;

        const courseExist = await findCourseByID(id);

        if (!courseExist) return res.status(404).json({ message: "Grado no encontrado." });

        const result = await removeCourse(id);

        if (!result) return res.status(500).json({ message: "Error al eliminar el grado." });

        res.status(200).json({ message: "Grado eliminado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al eliminar el grado." });
    }
}