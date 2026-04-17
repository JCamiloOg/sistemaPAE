import { findAllUsers, findUserByDocument, insertUser, modifyUser } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findRoleById } from "../models/roles.model.js";
import { SECRET_KEY } from "../config/env.js";



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

        // obtenemos todos los estudiantes
        const users = await findAllUsers();

        // devolvemos todos los estudiantes con el status 200
        res.status(200).json(users);
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

        if (!user) return res.status(404).json({ message: "Documento no encontrado." });

        // si la contraseña es incorrecta
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta." });

        // si el estudiante esta desactivado

        if (user.estado === 0) return res.status(401).json({ message: "El usuario esta desactivado." });

        // generamos el token de acceso y lo guardamos en la cookie
        const token = jwt.sign({ id: user.documento, role: user.role_id }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true });

        // devolvemos el estudiante con el status 200
        res.status(200).json({ message: "Inicio de sesión exitoso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al iniciar sesión." });
    }
}

export async function createUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        // obtenemos los datos del body
        const { document, password, role, email, name, lastName } = req.body;

        // si el estudiante ya existe
        const user = await findUserByDocument(document);

        if (user) return res.status(409).json({ message: "Documento ya registrado." });

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

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar usuario." });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Cierre de sesión exitoso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al cerrar sesión." });
    }
}