import { countUsers, findAllUsers, findUserByDocument, insertUser, modifyUser } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findRoleById } from "../models/roles.model.js";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/env.js";
import conn from "../config/db.js";


export async function dashboard(req, res) {
    try {

        const [[totalStudents], [totalUsers], [totalAssistanceToday], [totalOffensesToday], [studentsWithMoresOffenses], [assistanceForWeek], [upcomingDistribution], [notificationsForWeek], [lastIngresedStudents]] = await Promise.all([
            await conn.query("SELECT COUNT(*) AS total FROM estudiantes WHERE estado = ? ", ['Matriculado']),
            await conn.query("SELECT COUNT(*) AS total FROM usuarios WHERE estado = 1"),
            await conn.query("SELECT COUNT(*) AS total FROM asistencia WHERE DATE(fecha) = CURDATE() AND estado = 'Asistió'"),
            await conn.query("SELECT COUNT(*) AS total FROM asistencia WHERE DATE(fecha) = CURDATE() AND estado = 'No asistió'"),
            await conn.query("SELECT E.documento, CONCAT(E.nombre, ' ',E.apellido) AS nombreCompleto , G.grado, COUNT(*) AS total FROM estudiantes E INNER JOIN asistencia A ON E.documento = A.id_estudiante INNER JOIN grados G ON G.id_grado = E.grado WHERE A.estado = 'No asistió' AND MONTH(A.fecha) = MONTH(CURDATE()) AND `E`.estado = 'Matriculado'  GROUP BY E.documento HAVING total >= 3 ORDER BY total DESC LIMIT 5"),
            await conn.query(`SELECT d.dia, COALESCE(SUM(CASE WHEN YEARWEEK(a.fecha, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END), 0) AS semana_actual, COALESCE(SUM(CASE WHEN YEARWEEK(a.fecha, 1) = YEARWEEK(CURDATE(), 1) - 1 THEN 1 ELSE 0 END), 0) AS semana_pasada FROM (SELECT 2 AS num, 'Lunes' AS dia UNION SELECT 3, 'Martes' UNION SELECT 4, 'Miércoles' UNION SELECT 5, 'Jueves' UNION SELECT 6, 'Viernes') d LEFT JOIN asistencia a ON DAYOFWEEK(a.fecha) = d.num AND a.estado = 'Asistió' GROUP BY d.num, d.dia ORDER BY FIELD(d.dia,'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes')`),
            await conn.query("SELECT g.id_grado, g.grado, h.hora_inicio, h.hora_fin, h.turno, CASE WHEN CURTIME() BETWEEN h.hora_inicio AND h.hora_fin THEN 'En curso' WHEN h.hora_inicio > CURTIME() THEN 'Próximo' END AS estado FROM horarios h INNER JOIN grados g ON h.id_grado = g.id_grado WHERE CURTIME() BETWEEN h.hora_inicio AND h.hora_fin OR h.hora_inicio >= CURTIME() ORDER BY CASE WHEN CURTIME() BETWEEN h.hora_inicio AND h.hora_fin THEN 0 ELSE 1 END, h.hora_inicio ASC LIMIT 5"),
            await conn.query("SELECT n.titulo, n.mensaje, n.fecha, n.tipo, CONCAT(U.nombre, ' ', U.apellido) AS usuario, U.documento FROM usuario_notificacion un INNER JOIN notificaciones n ON un.id_notificacion = n.id_notificacion INNER JOIN usuarios U ON U.documento = un.id_usuario ORDER BY n.fecha DESC LIMIT 5"),
            await conn.query("SELECT E.documento, CONCAT(E.nombre, ' ', E.apellido) as nombreCompleto, G.grado, E.create_at FROM estudiantes E INNER JOIN grados G ON G.id_grado = E.grado ORDER BY E.create_at DESC LIMIT 5"),
        ]);

        res.status(200).json({
            totalStudents: totalStudents[0].total,
            totalUsers: totalUsers[0].total,
            totalAssistanceToday: totalAssistanceToday[0].total,
            totalOffensesToday: totalOffensesToday[0].total,
            studentsWithMoresOffenses,
            assistanceForWeek,
            upcomingDistribution,
            notificationsForWeek,
            lastIngresedStudents
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener dashboard." });
    }
}

export async function getUsers(req, res) {
    try {
        // obtener estudiante por documento
        const { document } = req.params;

        // si existe el documento
        if (document) {
            // obtenemos el estudiante
            const user = await findUserByDocument(document);

            // si no existe el estudiante
            if (!user) return res.status(404).json({ message: "Documento no encontrado." });

            // devolvemos el estudiante con el status 200
            return res.status(200).json(user);
        }

        let page = parseInt(req.query.page);

        if (isNaN(page)) page = 1;

        const limit = 5;
        const offset = (page - 1) * limit;

        const count = await countUsers();

        const totalPages = Math.ceil(count / limit);

        const [roles] = await conn.query("SELECT * FROM roles");
        // obtenemos todos los estudiantes
        const users = await findAllUsers(offset, limit);


        // devolvemos todos los estudiantes con el status 200
        res.status(200).json({ users, roles, totalPages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener usuarios." });
    }
}

/* bcrypy se usa para encriptar la contraseña, esto se hace para que la contraseña no se guarde en la base de datos como dato puro y la información se más segura (buenas practicas)  */

export async function login(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });
        // obtenemos los datos del body
        const { document, password } = req.body;

        // si el estudiante no existe
        const user = await findUserByDocument(document);

        // si no existe el estudiante
        if (!user) return res.status(401).json({ message: "Credenciales inválidas." });

        const resUser = {
            document: user.documento,
            name: user.nombre,
            lastName: user.apellido,
            email: user.correo,
            role: user.rol
        };

        // si la contraseña es incorrecta
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ message: "Credenciales inválidas." });

        // si el estudiante esta desactivado

        if (user.estado === 0) return res.status(401).json({ message: "El usuario se encuentra inactivo." });

        // generamos el token de acceso y lo guardamos en la cookie
        const accessToken = jwt.sign({ id: user.documento, role: user.role_id }, ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.documento, role: user.role_id }, REFRESH_SECRET, { expiresIn: "7d" });
        // const token = jwt.sign({ id: user.documento, role: user.role_id }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "None", secure: true, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000, partitioned: true });

        // devolvemos el estudiante con el status 200
        res.status(200).json({ message: "Inicio de sesión exitoso.", redirect: "/dashboard", user: resUser, accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: { message: "Error al iniciar sesión." } });
    }
}

export async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) return res.status(401).json({ message: "No hay token de acceso.", notFound: true });

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        if (!decoded) return res.status(401).json({ message: "Token de acceso invalido.", notFound: true });

        const user = await findUserByDocument(decoded.id);

        if (!user) return res.status(401).json({ message: "Token de acceso invalido.", notFound: true });

        if (user.estado === 0) return res.status(401).json({ message: "El usuario se encuentra inactivo.", notFound: true });

        const payLoad = {
            id: user.documento,
            role: user.role_id
        };

        const newAccessToken = jwt.sign(payLoad, ACCESS_SECRET, { expiresIn: "15m" });

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("refreshToken");
            return res.status(401).json({ message: "La sesión ha expirado. Inicia sesión de nuevo" });
        }
        if (error.name === "JsonWebTokenError") {
            res.clearCookie("refreshToken");
            return res.status(401).json({ message: "La sesión se ha roto. Inicia sesión de nuevo" });
        }

        return res.status(500).json({ message: "Error al refrescar el token." });
    }
}

export async function verifyToken(req, res) {
    try {
        // obtenemos el token de la cookie
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        // si no hay token
        if (!token) return res.status(401).json({ message: "No hay token de acceso.", notFound: true });


        // verificamos el token
        const decoded = jwt.verify(token, ACCESS_SECRET);

        // si el token es invalido
        if (!decoded) return res.status(401).json({ message: "Token de acceso invalido.", notFound: true });

        // buscamos el usuario por el id del token, es decir el documento
        const user = await findUserByDocument(decoded.id);

        // si el usuario no existe
        if (!user) return res.status(401).json({ message: "Token de acceso invalido." });

        // si el usuario esta desactivado
        if (user.estado === 0) return res.status(401).json({ message: "El usuario actualmente está desactivado, contacte un administrador." });

        return res.status(200).json({ redirect: "/dashboard" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("token");
            return res.status(401).json({ message: "La sesión ha expirado. Inicia sesión de nuevo" });
        }
        if (error.name === "JsonWebTokenError") {
            res.clearCookie("token");
            return res.status(401).json({ message: "La sesión se ha roto. Inicia sesión de nuevo" });
        }
        return res.status(500).json({ message: "Error al verificar token." });
    }

}

export async function createUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ errors: { message: "No se recibieron datos." } });

        // obtenemos los datos del body
        const { document, password, role, email, name, lastName } = req.body;

        // si el estudiante ya existe
        const user = await findUserByDocument(document);

        if (user) return res.status(400).json({ message: "Documento ya registrado." });

        // encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // si el rol no existe
        const roleUser = await findRoleById(role);

        if (!roleUser) return res.status(404).json({ message: "Rol no encontrado." });

        // creamos el estudiante
        const newUser = {
            documento: document,
            password: hashedPassword,
            role_id: role,
            correo: email,
            nombre: name,
            apellido: lastName
        };

        // creamos el estudiante
        const result = await insertUser(newUser);

        // si no se creo el estudiante
        if (!result) return res.status(500).json({ message: "Error al crear usuario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear usuario." });

        // devolvemos el estudiante con el status 201
        return res.status(201).json({ message: "Usuario creado exitosamente." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear usuario." });
    }
}

export async function updateUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        // obtenemos los datos del body
        const { password, role, email, name, lastName } = req.body;
        // obtenemos el los datos del body
        const { document } = req.params;

        // si el estudiante no existe
        const user = await findUserByDocument(document);

        // si el estudiante no existe
        if (!user) return res.status(404).json({ message: "Documento no encontrado." });

        // si el rol no existe
        const roleUser = await findRoleById(role);

        if (!roleUser) return res.status(404).json({ message: "Rol no encontrado." });

        // actualizamos el estudiante
        const updateUser = {
            role_id: role,
            correo: email,
            nombre: name,
            apellido: lastName
        };

        // si se va a actualizar la contraseña
        if (password) {
            // encriptamos la contraseña y la añadimos al estudiante
            const hashedPassword = await bcrypt.hash(password, 10);
            updateUser.password = hashedPassword;
        }

        // actualizamos el estudiante
        const result = await modifyUser(updateUser, document);

        // si no se actualizo el estudiante
        if (!result) return res.status(500).json({ message: "Error al actualizar usuario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar usuario." });

        // devolvemos el estudiante con el status 200
        return res.status(200).json({ message: "Usuario actualizado exitosamente." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar usuario." });
    }
}

export async function updateStatusUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { status } = req.body;
        const { document } = req.params;


        if (status !== 0 && status !== 1) return res.status(400).json({ message: "El estado es incorrecto." });

        const user = await findUserByDocument(document);

        if (!user) return res.status(404).json({ message: "Documento no encontrado." });

        const updateUser = {
            estado: status
        };

        const result = await modifyUser(updateUser, document);

        if (!result) return res.status(500).json({ message: "Error al actualizar usuario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar usuario." });

        return res.status(200).json({ message: "El estado del usuario ha sido actualizado exitosamente." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar usuario." });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            partitioned: true
        });
        res.status(200).json({ message: "Cierre de sesión exitoso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al cerrar sesión." });
    }
}