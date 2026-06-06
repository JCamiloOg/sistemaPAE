/* Componets */
import { faFloppyDisk, faPenToSquare, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/shared/components/modal/Modal";
import Table from "@/shared/components/table/Table";
import Button from "@/shared/components/Button";
import { Toast } from "@/shared/ui/alerts";
import Badge from "@/shared/components/Badge";
import SelectModal from "@/shared/components/modal/SelectModal";
import InputModal from "@/shared/components/modal/InputModal";
import ToggleButton from "@/shared/components/ToggleButton";

/* Hooks */
import useModal from "@/shared/hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import useAxiosError from "@/shared/hooks/useAxiosError";

/* Services */
import { changeUserStatus, getAllUsers, insertUser, updateUser } from "@/features/dashboard/api/users";

/* Types */
import type { Roles, User, UserDB } from "@/features/dashboard/types/users";

export default function Users() {
    const [users, setUsers] = useState<UserDB[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [mode, setMode] = useState<"create" | "update">("create");
    const { startLoading, stopLoading } = usePageLoader();
    const { isOpen, openModal, closeModal } = useModal();

    const navigate = useNavigate();
    const { handleError } = useAxiosError();
    const { page } = useSearch({ from: "/dashboard/users" });

    const form = useForm({
        defaultValues: selectedUser || {
            document: "",
            name: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
        },
        onSubmit: async ({ value }) => {
            try {
                let response;

                if (mode === "create") response = await insertUser(value);
                else response = await updateUser(value);

                if (response?.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: response?.data.message,
                    });
                }
                closeModal();
                onLoad();
                startLoading();

            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }
        }

    });

    const selectEditUser = (id: string) => {
        const user = users.map((user) => ({
            document: user.documento,
            name: user.nombre,
            lastName: user.apellido,
            email: user.correo,
            role: user.id_rol,
            password: ""
        })).filter((user) => user.document === id)[0];


        setSelectedUser(user);
        setMode("update");
        openModal();
    };

    const handleChangeStatusUser = async (id: string, newStatus: 0 | 1) => {
        try {
            const response = await changeUserStatus(id, newStatus);
            if (response.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: response.data.message,
                });

                onLoad();
            }
        } catch (error) {
            handleError(error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            if (!isOpen) {
                form.reset({
                    document: "",
                    name: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: "",
                });
                setSelectedUser(null);
            }
        }, 200);
    }, [isOpen, form]);


    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getAllUsers(page);

            if (response.status === 200) {
                setUsers(response.data.users);
                setRoles(response.data.roles);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    }, [startLoading, stopLoading, page, handleError]);

    useEffect(() => {
        onLoad();
    }, [startLoading, stopLoading, navigate, onLoad]);

    return (
        <>
            <Table>
                <Table.Header title="Listado de usuarios" description="Aqui se muestran todos los usuarios" action={<Button type="button" title="Crear usuario" icon={faPlus} color="green" onClick={() => {
                    setMode("create");
                    openModal();
                }} />} />

                <Table.Table>
                    <Table.Thead>
                        <Table.Row head>
                            <Table.Cell className="font-bold" rounded="left">Documento</Table.Cell>
                            <Table.Cell className="font-bold">Nombre</Table.Cell>
                            <Table.Cell className="font-bold">Apellido</Table.Cell>
                            <Table.Cell className="font-bold">Correo</Table.Cell>
                            <Table.Cell className="font-bold">Rol</Table.Cell>
                            <Table.Cell className="font-bold">Estado</Table.Cell>
                            <Table.Cell className="text-right font-bold">Acciones</Table.Cell>
                        </Table.Row>
                    </Table.Thead>

                    <Table.Tbody>
                        {
                            users.map((user, idx) => (
                                <Table.Row key={idx}>
                                    <Table.Cell className="font-medium" rounded="left">{user.documento}</Table.Cell>
                                    <Table.Cell>{user.nombre}</Table.Cell>
                                    <Table.Cell>{user.apellido}</Table.Cell>
                                    <Table.Cell>{user.correo}</Table.Cell>
                                    <Table.Cell>{user.rol}</Table.Cell>
                                    <Table.Cell>
                                        {<Badge title={user.estado ? "Activo" : "Inactivo"} type={user.estado ? "primary" : "secondary"} />}
                                    </Table.Cell>
                                    <Table.Cell rounded="right">
                                        <div className="flex justify-end gap-2">
                                            <Button title="Editar" type="button" onClick={() => selectEditUser(user.documento)} icon={faPenToSquare} color="green" size="sm" variant="outline" />
                                            <div className="mt-1">
                                                <ToggleButton onClick={() => handleChangeStatusUser(user.documento, user.estado ? 0 : 1)} title="Cambiar de estado" active={user.estado ? true : false}></ToggleButton>
                                            </div>
                                            {/* <Button title="Eliminar" type="button" onClick={() => handleChangeStatusUser(user.documento)} icon={faTrashCan} color="rose" size="sm" variant="semi" /> */}
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Tbody>
                </Table.Table>
                <Table.Pagination totalPages={totalPages} currentPage={page} onPageChange={(page) => navigate({ to: `/dashboard/users`, search: { page } })} />
            </Table>

            <Modal isOpen={isOpen} title={mode === "create" ? "Crear usuario" : "Actualizar usuario"} description={mode === "create" ? "Aqui se puede crear un nuevo usuario" : "Aqui se puede actualizar un usuario"} closeModal={closeModal}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El campo es requerido";
                                    if (value.length < 6) return "El campo debe tener al menos 6 caracteres";
                                    if (value.length > 20) return "El campo debe tener máximo 10 caracteres";
                                    if (!/^[0-9]+$/.test(value)) return "El campo debe contener solo números";
                                }
                            }}
                            name="document"
                            children={(field) => (
                                <InputModal
                                    label="Documento"
                                    placeholder="Ingrese el documento"
                                    type="number"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        />

                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El campo es requerido";
                                    if (value.length < 4) return "El campo debe tener al menos 4 caracteres";
                                    if (value.length > 40) return "El campo debe tener máximo 20 caracteres";
                                    if (!/^[a-zA-ZÁÉÍÓÚaéíóú\s]+$/.test(value)) return "El campo debe contener solo letras";
                                }
                            }}
                            name="name"
                            children={(field) => (
                                <InputModal
                                    label="Nombres"
                                    placeholder="Ingrese los nombres"
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        />

                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El campo es requerido";
                                    if (value.length < 4) return "El campo debe tener al menos 4 caracteres";
                                    if (value.length > 40) return "El campo debe tener máximo 20 caracteres";
                                    if (!/^[a-zA-ZÁÉÍÓÚaéíóú\s]+$/.test(value)) return "El campo debe contener solo letras";
                                }
                            }}
                            name="lastName"
                            children={(field) => (
                                <InputModal
                                    label="Apellidos"
                                    placeholder="Ingrese los apellidos"
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        />

                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El campo es requerido";
                                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "El campo debe ser un correo válido";
                                }
                            }}
                            name="email"
                            children={(field) => (
                                <InputModal
                                    label="Correo"
                                    placeholder="Ingrese el correo"
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        />


                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value) return "El campo es requerido";
                                }
                            }}
                            name="role"
                        >
                            {(field) => (
                                <SelectModal
                                    label="Rol"
                                    error={field.state.meta.errors?.[0]}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                >
                                    <option value="">Seleccione un rol...</option>
                                    {roles.map((role) => (
                                        <option key={role.id_rol} value={role.id_rol}>{role.rol}</option>
                                    ))}
                                </SelectModal>
                            )}

                        </form.Field>

                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (mode === "create") {
                                        if (!value || !value.trim()) return "La contraseña es obligatoria";
                                        if (value.length < 6) return "La contraseña debe tener al menos 8 caracteres";
                                        if (value.length > 20) return "La contraseña debe tener máximo 20 caracteres";
                                    }
                                }
                            }}
                            name="password"
                            children={(field) => (
                                <InputModal
                                    col="col2"
                                    label={`${mode === "update" ? "Actualizar contraseña" : "Contraseña"} ${mode === "update" ? "(Opcional)" : ""}`}
                                    placeholder="Ingrese la contraseña"
                                    type="password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                        />
                    </div>
                    <Modal.Footer>
                        <Button
                            title="Cancelar"
                            type="button"
                            icon={faXmark}
                            color="gray"
                            variant="outline"
                            onClick={closeModal}
                        />
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <>
                                    <Button

                                        title={
                                            isSubmitting
                                                ? "Guardando..."
                                                : mode === "create"
                                                    ? "Guardar"
                                                    : "Actualizar"
                                        }
                                        type="submit"
                                        icon={faFloppyDisk}
                                        color="green"
                                        disabled={!canSubmit || isSubmitting}
                                    />
                                </>
                            )}
                        />
                    </Modal.Footer>
                </form>

            </Modal>
        </>
    );
}
