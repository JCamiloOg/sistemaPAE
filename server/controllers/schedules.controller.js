import { findAllSchedules, findScheduleByCourse, findScheduleByID, insertSchedule, modifySchedule, removeSchedule } from "../models/schedules.model.js";

export async function getSchedules(req, res) {
    try {
        // obtener horario por id ej: /api/schedules/1
        const { id } = req.params;

        // si existe el id
        if (id) {
            // obtenemos el horario
            const schedule = await findScheduleByID(id);

            // si no existe el horario
            if (!schedule) return res.status(404).json({ message: "Horario no encontrado." });

            // devolvemos el horario con el status 200
            return res.status(200).json(schedule);
        }

        // obtenemos todos los horarios
        const schedules = await findAllSchedules();
        // devolvemos todos los horarios con el status 200
        res.status(200).json(schedules);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener horarios." });
    }
}

export async function createSchedule(req, res) {
    try {
        // obtenemos la informacion del body
        const { startSchedule, endSchedule, turn, course } = req.body;

        // si el grado ya tiene un horario
        const courseExist = await findScheduleByCourse(course);

        if (courseExist) return res.status(409).json({ message: "El grado ya tiene un horario registrado." });

        // creamos el horario
        const newSchedule = {
            id_grado: course,
            hora_inicio: startSchedule,
            hora_fin: endSchedule,
            turno: turn
        };

        const result = await insertSchedule(newSchedule);

        // si no se creo el horario
        if (!result) return res.status(500).json({ message: "Error al crear horario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear horario." });

        // devolvemos el horario con el status 201
        res.status(201).json({ message: "Horario creado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear horario." });
    }
}


export async function updateSchedule(req, res) {
    try {
        // obtenemos la informacion del body
        const { startSchedule, endSchedule, turn, course } = req.body;
        // obtenemos el id del horario que queremos actualizar
        const { id } = req.params;

        // si el horario no existe
        const scheduleExist = await findScheduleByID(id);

        if (!scheduleExist) return res.status(404).json({ message: "Horario no encontrado." });

        // si el grado ya tiene un horario
        const courseExist = await findScheduleByCourse(course);

        if (courseExist) return res.status(409).json({ message: "El grado ya tiene un horario registrado." });

        // actualizamos el horario
        const result = await modifySchedule({ id_grado: course, hora_inicio: startSchedule, hora_fin: endSchedule, turno: turn }, id);

        // si no se actualizo el horario
        if (!result) return res.status(500).json({ message: "Error al actualizar el horario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar el horario." });

        // devolvemos el horario con el status 200
        res.status(200).json({ message: "Horario actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar el horario." });
    }
}


export async function deleteSchedule(req, res) {
    try {
        // obtenemos el id del horario que queremos eliminar
        const { id } = req.params;

        // si el horario no existe
        const scheduleExist = await findScheduleByID(id);

        if (!scheduleExist) return res.status(404).json({ message: "Horario no encontrado." });

        // eliminamos el horario
        const result = await removeSchedule(id);

        if (!result) return res.status(500).json({ message: "Error al eliminar el horario." });

        // devolvemos el horario con el status 200
        res.status(200).json({ message: "Horario eliminado exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al eliminar el horario." });
    }
}