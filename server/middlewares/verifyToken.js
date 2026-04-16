import jwt from "jsonwebtoken";
import { findUserByDocument } from "../models/users.model.js";


export async function authenticate(req, res, next) {

    try {

        const { token } = req.cookies;

        if (!token) return res.status(401).json({ message: "Acceso no autorizado." });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) return res.status(401).json({ message: "Acceso no autorizado." });

        const user = await findUserByDocument(decoded.id);

        if (!user) return res.status(401).json({ message: "Acceso no autorizado." });

        req.user = user;

        if (user.estado === 0) return res.status(401).json({ message: "Acceso no autorizado." });

        next();
    } catch (error) {
        console.log(error);

        if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Sesión expirada inicia sesión de nuevo." });


        return res.status(500).json({ message: "Error al verificar el token." });
    }
}

export function authenticateRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.rol)) return res.status(401).json({ message: "Acceso no autorizado." });

        next();
    };
}