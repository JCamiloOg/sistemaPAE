export interface UserDB {
    documento: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    estado: string;
    create_at: string;
    password: string;
    id_rol: string;
}

export interface User {
    document: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface LoggedUser {
    document: string;
    name: string;
    lastName: string;
    email: string;
    role: "Administrador" | "Encargado PAE";
}

export interface Roles {
    id_rol: number;
    rol: string;
    description: string;
}

export type InsertUser = Omit<User, "create_at"> & { password: string };