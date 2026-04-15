import jwt from "jsonwebtoken";
import { findUserByDocument } from "../models/users.model.js";


export async function verifyTokenAdmin(req, res, next) {

    try {
        const { token } = req.cookies;

        if (!token) return res.status(401).json({ message: "Acceso no autorizado." });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) return res.status(401).json({ message: "Acceso no autorizado." });

        const user = await findUserByDocument(decoded.id);

        if (!user) return res.status(401).json({ message: "Acceso no autorizado." });

        if (user.estado === 0) return res.status(401).json({ message: "Acceso no autorizado." });

        if (user.role_id !== 1) return res.status(401).json({ message: "Acceso no autorizado." });

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al verificar el token." });
    }
}

export async function verifyTokenInCharge(req, res, next) {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(401).json({ message: "Acceso no autorizado." });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) return res.status(401).json({ message: "Acceso no autorizado." });

        const user = await findUserByDocument(decoded.id);

        if (!user) return res.status(401).json({ message: "Acceso no autorizado." });

        if (user.estado === 0) return res.status(401).json({ message: "Acceso no autorizado." });

        if (user.role_id !== 2) return res.status(401).json({ message: "Acceso no autorizado." });

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al verificar el token." });
    }
}