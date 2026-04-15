import { findAllUsers, findUserByDocument, insertUser, modifyUser } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findRoleById } from "../models/roles.model.js";
import { SECRET_KEY } from "../config/env.js";



export async function getUsers(req, res) {
    try {
        const { document } = req.params;

        if (document) {
            const user = await findUserByDocument(document);

            if (!user) return res.status(404).json({ message: "Documento no encontrado." });

            return res.status(200).json(user);
        }

        const users = await findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener usuarios." });
    }
}


export async function login(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });
        const { document, password } = req.body;

        const user = await findUserByDocument(document);

        if (!user) return res.status(404).json({ message: "Documento no encontrado." });

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta." });

        const token = jwt.sign({ id: user.documento, role: user.role_id }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: "Inicio de sesión exitoso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al iniciar sesión." });
    }
}

export async function createUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { document, password, role, email, name, lastName } = req.body;

        const user = await findUserByDocument(document);

        if (user) return res.status(409).json({ message: "Documento ya registrado." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const roleUser = await findRoleById(role);

        if (!roleUser) return res.status(404).json({ message: "Rol no encontrado." });

        const newUser = {
            documento: document,
            password: hashedPassword,
            role_id: role,
            correo: email,
            nombre: name,
            apellido: lastName
        };

        const result = await insertUser(newUser);

        if (!result) return res.status(500).json({ message: "Error al crear usuario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al crear usuario." });

        return res.status(201).json({ message: "Usuario creado exitosamente." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear usuario." });
    }
}

export async function updateUser(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { password, role, email, name, lastName } = req.body;
        const { document } = req.params;

        const user = await findUserByDocument(document);

        if (!user) return res.status(404).json({ message: "Documento no encontrado." });

        const updateUser = {
            role_id: role,
            correo: email,
            nombre: name,
            apellido: lastName
        };


        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateUser.password = hashedPassword;
        }

        const result = await modifyUser(updateUser, document);

        if (!result) return res.status(500).json({ message: "Error al actualizar usuario." });

        if (!result.affectedRows) return res.status(500).json({ message: "Error al actualizar usuario." });

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