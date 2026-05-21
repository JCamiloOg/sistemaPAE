export interface NotificationDB {
    id_notificacion: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    tipo: string;
    usuario: string;
    documento: string;
}


export interface Notification {
    id?: number;
    title: string;
    message: string;
    date?: string;
    type?: string;
}