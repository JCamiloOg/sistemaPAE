import jwt from "jsonwebtoken";
import { findUserByDocument } from "../models/users.model.js";


export async function authenticate(req, res, next) {

    try {
        // obtenemos el token de las cookies
        const { token } = req.cookies;

        // si no hay token
        if (!token) return res.status(401).json({ message: "Acceso no autorizado." });

        // verificamos el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // si el token es invalido
        if (!decoded) return res.status(401).json({ message: "Acceso no autorizado." });

        // buscamos el usuario por el id del token, es decir el documento
        const user = await findUserByDocument(decoded.id);

        // si el usuario no existe
        if (!user) return res.status(401).json({ message: "Acceso no autorizado." });

        // si el usuario esta desactivado
        if (user.estado === 0) return res.status(401).json({ message: "Acceso no autorizado." });

        // agregamos el usuario al request
        req.user = user;

        // agregamos el rol al response original
        const originalJson = res.json;

        res.json = function (data) {
            const extra = {
                role: user.rol
            };

            const newData = { ...data, ...extra };

            return originalJson.call(this, newData);
        };

        // pasamos al siguiente middleware o ruta final si todo es correcto
        next();
    } catch (error) {
        console.log(error);

        // si el token ha expirado
        if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Sesión expirada inicia sesión de nuevo." });

        // si el token es invalido
        return res.status(500).json({ message: "Error al verificar el token." });
    }
}

// middleware para verificar el rol
export function authenticateRoles(...allowedRoles) {
    return (req, res, next) => {
        // si el rol no esta en la lista de roles permitidos
        if (!allowedRoles.includes(req.user.rol)) return res.status(401).json({ message: "Acceso no autorizado." });

        // pasamos al siguiente middleware o ruta final
        next();
    };
}