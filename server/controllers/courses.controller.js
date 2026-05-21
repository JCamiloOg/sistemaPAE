import { countCourses, findAllCourses, findAllCoursesWithSchedule, findCourseByID, findCourseByName, insertCourse, modifyCourse, removeCourse } from "../models/courses.model.js";
import { insertSchedule, modifySchedule, removeScheduleByCourse } from "../models/schedules.model.js";
import { findStudentsByCourse } from "../models/students.model.js";

/* Los CONTROLADORES son funciones que se ejecutan desde las rutas para realizar acciones y devolver respuestas al cliente */

/* Los estados (status) son para indicar el estado de la respuesta al cliente, los 200 son para indicar que la respuesta fue exitosa, los 400 y 500 son para indicar que la respuesta fue fallida */

/* Los bloques try catch son para manejar errores, si ocurre un error en alguna acción dentro del try se ejecuta el bloque catch */
// obtener grados
export async function getCoursesAndSchedules(req, res) {
    try {
        // obtener grado por id ej: /api/courses/1
        const { id } = req.params;

        // si existe el id
        if (id) {
            // obtenemos el grado
            const course = await findCourseByID(id);

            // si no existe el grado
            if (!course) return res.status(404).json({ message: "Grado no encontrado." });

            // devolvemos el grado con el status 200
            return res.status(200).json({ course });
        }

        // obtenemos todos los grados
        const { page } = req.query;

        if (page) {
            const limit = 5;
            const offset = (page - 1) * limit;

            const [totalCourses, courses] = await Promise.all([
                countCourses(),
                findAllCoursesWithSchedule(offset, limit)
            ]);

            const totalPages = Math.ceil(totalCourses / limit);

            return res.status(200).json({ courses, totalPages });
        }

        const courses = await findAllCoursesWithSchedule();
        // devolvemos todos los grados con el status 200
        res.status(200).json({ courses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener el grado." });
    }
}

export async function getCourses(req, res) {
    try {

        // obtenemos el grado
        const courses = await findAllCourses();

        // devolvemos el grado con el status 200
        res.status(200).json({ courses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener el grado." });
    }
}


export async function createCourse(req, res) {
    try {
        // obtenemos el grado del body (los datos que enviamos en la peticion)
        const { course, start_time, end_time, turn } = req.body;

        // si el grado ya existe
        const courseExist = await findCourseByName(course);

        if (courseExist) return res.status(409).json({ message: "Grado ya registrado." });

        // creamos el grado
        const result = await insertCourse({ grado: course });

        // si no se creo el grado
        if (!result) return res.status(500).json({ message: "Error al crear el grado." });

        // si no se creo el grado
        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear el grado." });

        const schedule = await insertSchedule({ id_grado: result.insertId, hora_inicio: start_time, hora_fin: end_time, turno: turn });

        // si no se creo el horario
        if (!schedule) return res.status(500).json({ message: "Error al crear horario." });

        if (!schedule.affectedRows) return res.status(500).json({ message: "Error al crear horario." });

        // devolvemos el grado con el status 201
        res.status(201).json({ message: "Grado creado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear el grado." });
    }
}

export async function updateCourse(req, res) {
    try {
        // obtenemos el grado del body
        const { course, id_schedule, start_time, end_time, turn } = req.body;
        // obtenemos el id del grado que queremos actualizar
        const { id } = req.params;

        // si el grado no existe
        const courseExist = await findCourseByID(id);

        if (!courseExist) return res.status(404).json({ message: "Grado no encontrado." });

        // si el grado ya existe
        if (courseExist.grado !== course) {
            const repeatCourse = await findCourseByName(course);

            if (repeatCourse) return res.status(409).json({ message: "Grado ya registrado." });
        }

        // actualizamos el grado
        const result = await modifyCourse({ grado: course }, id);

        // si no se actualizo el grado
        if (!result) return res.status(500).json({ message: "Error al actualizar el grado." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar el grado." });

        const schedule = await modifySchedule({ hora_inicio: start_time, hora_fin: end_time, turno: turn }, id_schedule);

        // si no se actualizo el horario
        if (!schedule) return res.status(500).json({ message: "Error al actualizar el horario." });

        if (!schedule.affectedRows) return res.status(500).json({ message: "Error al actualizar el horario." });

        // devolvemos el grado con el status 200
        res.status(200).json({ message: "Grado actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar el grado." });
    }
}

export async function deleteCourse(req, res) {
    try {
        // obtenemos el id del grado que queremos eliminar
        const { id } = req.params;

        // si el grado no existe
        const courseExist = await findCourseByID(id);

        if (!courseExist) return res.status(404).json({ message: "Grado no encontrado." });

        const studentsExist = await findStudentsByCourse(id, 1, 0);

        if (studentsExist && studentsExist.length > 0) return res.status(409).json({ message: "No se puede eliminar el grado porque tiene estudiantes inscritos." });

        await removeScheduleByCourse(id);

        // eliminamos el grado
        const result = await removeCourse(id);

        // si no se elimino el grado
        if (!result) return res.status(500).json({ message: "Error al eliminar el grado." });

        // devolvemos el grado con el status 200
        res.status(200).json({ message: "Grado eliminado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al eliminar el grado." });
    }
}