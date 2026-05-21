import { useCallback, useEffect, useState } from "react";
import type { Notification, NotificationDB } from "../types/notifications";
import useAxiosError from "@/shared/hooks/useAxiosError";
import { createNotification, fetchNotifications, updateNotification, updateTypeNotification } from "../api/notifications";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import Table from "@/shared/components/table/Table";
import { faEye, faFloppyDisk, faPenToSquare, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "@/shared/components/Button";
import Popover from "@/shared/components/Popover";
import useModal from "@/shared/hooks/useModal";
import { useForm } from "@tanstack/react-form";
import Modal from "@/shared/components/modal/Modal";
import { Toast } from "@/shared/ui/alerts";
import InputModal from "@/shared/components/modal/InputModal";
import GlassRadioGroup from "@/shared/components/RadioButtons";
import { diffDate } from "@/shared/lib/dateFormat";
import Badge from "@/shared/components/Badge";


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationDB[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [notificationSelected, setNotificationSelected] = useState<Notification | null>(null);

    const notificationsOptions = [
        { label: "General", value: "General", },
        { label: "Información", value: "Información", },
        { label: "Urgente", value: "Urgente" },
    ];

    const form = useForm({
        defaultValues: notificationSelected || {
            title: "",
            message: "",
            type: "General",
        },
        onSubmit: async ({ value }) => {
            try {
                let response;

                if (mode === "create") response = await createNotification(value);
                else response = await updateNotification(value);

                if (response?.status === 200 || response?.status === 201) {
                    Toast.fire({
                        icon: "success",
                        title: response?.data.message,
                    });
                    closeModal();
                    onLoad();
                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }
        }
    });
    const { page } = useSearch({ from: "/dashboard/notifications" });
    const navigate = useNavigate();
    const { startLoading, stopLoading } = usePageLoader();
    const { handleError } = useAxiosError();
    const { isOpen, closeModal, openModal } = useModal();

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const res = await fetchNotifications(page || 1);

            if (res.status === 200) {
                setNotifications(res.data.notifications);
                setTotalPages(res.data.totalPages);
            }

        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    }, [handleError, page, startLoading, stopLoading]);

    const handleEditNotification = (id: number) => {
        setMode("update");
        const notification = notifications.filter((notification) => notification.id_notificacion === id)
            .map((notification) => ({
                id: id,
                title: notification.titulo,
                message: notification.mensaje,
                type: notification.tipo
            }))[0];

        setNotificationSelected(notification);
        openModal();
    };

    const handleUpdateTypeNotification = async (id: number, type: string) => {
        if (id === 0) {
            Toast.fire({
                icon: "error",
                title: "No se ha seleccionado ninguna notificación",
            });
            return;
        }

        startLoading();
        try {
            const res = await updateTypeNotification(id, type);

            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: res.data.message,
                });

                onLoad();
            }
        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    };

    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        setTimeout(() => {
            if (!isOpen) {
                form.reset({
                    title: "",
                    message: "",
                    type: "General"
                });
                setNotificationSelected(null);
            }
        }, 200);
    }, [isOpen, form]);
    return (
        <>
            <Table>
                <Table.Header
                    title="Listado de Notificaciones"
                    description="Aquí puedes ver un historial completo de todas las notificaciones"
                    action={<Button
                        color="green"
                        icon={faPlus}
                        onClick={() => {
                            setMode("create");
                            openModal();
                        }}
                        title="Nueva Notificación"
                        type="button" />}
                />
                <Table.Table>
                    <Table.Thead>
                        <Table.Row head>
                            <Table.Cell rounded="left">Tiempo de publicación</Table.Cell>
                            <Table.Cell>Título</Table.Cell>
                            <Table.Cell>Nombre del remitente</Table.Cell>
                            <Table.Cell>Tipo</Table.Cell>
                            <Table.Cell rounded="right">Acciones</Table.Cell>
                        </Table.Row>
                    </Table.Thead>
                    <Table.Tbody>
                        {
                            notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Table.Row key={notification.id_notificacion}>
                                        <Table.Cell>{`${diffDate(new Date(), new Date(notification.fecha), false, true)}`}</Table.Cell>
                                        <Table.Cell>{notification.titulo}</Table.Cell>
                                        <Table.Cell>{notification.usuario}</Table.Cell>
                                        <Table.Cell>
                                            {
                                                notification.tipo === "General" && (
                                                    <Badge title={notification.tipo} type="primary" />
                                                )
                                                || notification.tipo === "Información" && (
                                                    <Badge title={notification.tipo} type="secondary" />
                                                )
                                                || notification.tipo === "Urgente" && (
                                                    <Badge title={notification.tipo} type="danger" />
                                                )
                                            }
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end gap-2">
                                                <Popover
                                                    customTrigger={
                                                        <Button
                                                            color="green"
                                                            icon={faEye}
                                                            variant="semi"
                                                            size="sm"
                                                            onClick={() => { }}
                                                            title="Ver más"
                                                            type="button" />
                                                    }
                                                    placement="left-start"
                                                    title={`Detalles de la notificación #${notification.id_notificacion}`}
                                                >
                                                    <div className="space-y-2 text-left min-w-[220px]">
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-green-600 block mb-0.5">Título</span>
                                                            <p className="font-semibold text-green-900 leading-snug">{notification.titulo}</p>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="text-[10px] uppercase font-bold text-green-600 block mb-0.5">Mensaje</span>
                                                            <p className="text-gray-600  text-xs leading-normal wrap-break-word max-h-32 overflow-y-auto pr-1">
                                                                {notification.mensaje}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 border-t border-green-100/50 pt-2 mt-2 text-[10px] text-green-600/70">
                                                            <span className="truncate">Remitente: <strong className="text-green-800">{notification.usuario}</strong></span>
                                                            <span>Fecha: <strong>{Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(notification.fecha))}</strong></span>
                                                        </div>
                                                    </div>
                                                </Popover>
                                                <Button color="green" variant="outline" size="sm" icon={faPenToSquare} onClick={() => handleEditNotification(notification.id_notificacion)} title="Editar" type="button" />
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell className="text-center" colSpan={8}>No hay notificaciones</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Tbody>
                </Table.Table>
                <Table.Pagination
                    currentPage={page}
                    onPageChange={(page) => {
                        navigate({ to: '/dashboard/notifications', search: { page } });
                    }}
                    totalPages={totalPages}
                />
            </Table>


            <Modal
                closeModal={closeModal}
                isOpen={isOpen}
                title={mode === "create" ? "Crear notificación" : "Editar notificación"}
                description={mode === "create" ? "Aqui puedes crear una nueva notificación para los usuarios." : "Aqui puedes editar una notificación existente."}
            >

                <form onSubmit={(e) => {
                    e.preventDefault();
                    form._handleSubmit();
                }}>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <form.Field
                            name="title"
                            children={(field) => (
                                <InputModal
                                    label="Título"
                                    placeholder="Título"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                    type="text"
                                    col="col2"
                                />
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El titulo es requerido";
                                    if (value.length > 50) return "El titulo debe tener menos de 50 caracteres";
                                }
                            }}
                        />

                        <form.Field
                            name="message"
                            children={(field) => (
                                <InputModal
                                    label="Descripción"
                                    placeholder="Descripción"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                    type="text"
                                    col="col2"
                                />
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El mensaje es requerido";
                                    if (value.length > 1000) return "El mensaje debe tener menos de 1000 caracteres";
                                }
                            }}
                        />

                        <form.Field
                            name="type"
                            children={(field) => (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de notificación (No es necesario guardar el formulario)</label>
                                    <GlassRadioGroup
                                        value={field.state.value || "General"}
                                        onChange={(value) => {
                                            field.handleChange(value);

                                            if (mode === "update") handleUpdateTypeNotification(notificationSelected?.id || 0, value);

                                        }}
                                        options={notificationsOptions}
                                    />
                                </div>
                            )}

                        />

                    </div>
                    <Modal.Footer>
                        <Button
                            icon={faXmark}
                            color="gray"
                            variant="outline"
                            size="md"
                            title="Cancelar"
                            type="button" onClick={closeModal} />

                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    icon={faFloppyDisk}
                                    color="green"
                                    size="md"
                                    title={isSubmitting ? mode === "create" ? "Guardando..." : "Actualizando..." : mode === "create" ? "Guardar" : "Actualizar"}
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                />
                            )}
                        />
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    );

}