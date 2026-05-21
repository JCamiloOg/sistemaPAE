import Button from "@/shared/components/Button";
import Table from "@/shared/components/table/Table";
import useModal from "@/shared/hooks/useModal";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { faFloppyDisk, faPenToSquare, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import type { Course, CourseDB } from "../types/course";
import { MySwal, Toast } from "@/shared/ui/alerts";
import { deleteCourse, getAllCoursesAndSchedules, insertCourse, updateCourse } from "../api/courses";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Modal from "@/shared/components/modal/Modal";
import { useForm } from "@tanstack/react-form";
import InputModal from "@/shared/components/modal/InputModal";
import SelectModal from "@/shared/components/modal/SelectModal";
import useAxiosError from "@/shared/hooks/useAxiosError";

export default function CoursesPage() {
    const [mode, setMode] = useState<"create" | "update">("create");
    const [courses, setCourses] = useState<CourseDB[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const navigate = useNavigate();
    const { handleError } = useAxiosError();

    const form = useForm({
        defaultValues: selectedCourse || {
            course: "",
            start_time: "",
            end_time: "",
            turn: "Mañana"
        },
        onSubmit: async ({ value }) => {
            try {
                const response = mode === "create" ? await insertCourse(value) : await updateCourse(value);
                if (response.status === 200 || response.status === 201) {
                    Toast.fire({
                        icon: "success",
                        title: response.data.message,
                    });
                    closeModal();
                    onLoad();
                    startLoading();
                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }
        }
    });

    const { page } = useSearch({ from: "/dashboard/courses" });

    const { startLoading, stopLoading } = usePageLoader();
    const { isOpen, openModal, closeModal } = useModal();

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getAllCoursesAndSchedules(page);
            if (response.status === 200) {
                setCourses(response.data.courses);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }

    }, [startLoading, stopLoading, page, handleError]);

    const handleSelectCourse = (id: number) => {
        const course = courses.filter((course) => course.id_grado === id).map((course) => ({
            id_course: course.id_grado,
            course: course.grado,
            id_schedule: course.id_horario,
            start_time: course.hora_inicio,
            end_time: course.hora_fin,
            turn: course.turno
        }));

        setSelectedCourse(course[0]);
        setMode("update");
        openModal();
    };

    const handleDeleteCourse = (id: number) => {
        MySwal.fire({
            title: `¿Estas seguro de eliminar el curso ${courses.find((course) => course.id_grado === id)?.grado}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: '#faf8f5',
            color: '#3f3125',
            confirmButtonColor: '#016630',
            cancelButtonColor: '#5d625f',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteCourse(id);
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
            }
        });
    };

    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        onLoad();
    }, [page, onLoad]);

    useEffect(() => {
        setTimeout(() => {
            if (!isOpen) {
                form.reset({
                    course: "",
                    id_schedule: 0,
                    start_time: "",
                    end_time: "",
                    turn: "Mañana"
                });
                setSelectedCourse(null);
            }
        }, 200);
    }, [isOpen, form]);


    return (
        <>
            <Table>
                <Table.Header title="Cursos registrados" description="Estos son los cursos registrados en el sistema" action={<Button type="button" title="Crear curso" icon={faPlus} variant="default" color="green" onClick={() => {
                    setMode("create");
                    openModal();
                }} />} />
                <Table.Table>
                    <Table.Thead>
                        <Table.Row head>
                            <Table.Cell className="font-bold" rounded="left">Grado</Table.Cell>
                            <Table.Cell className="font-bold">Turno</Table.Cell>
                            <Table.Cell className="font-bold text-center">Hora inicio de reparto</Table.Cell>
                            <Table.Cell className="font-bold text-center">Hora fin de reparto</Table.Cell>
                            <Table.Cell className="font-bold">Acciones</Table.Cell>
                        </Table.Row>
                    </Table.Thead>

                    <Table.Tbody>
                        {courses && courses.length > 0 ? (
                            courses.map((course) => (
                                <Table.Row key={course.id_grado} >
                                    <Table.Cell rounded="left">{course.grado}</Table.Cell>
                                    <Table.Cell>{course.turno}</Table.Cell>
                                    <Table.Cell className="text-center">{Intl.DateTimeFormat('es-CO', { hour: "numeric", minute: "2-digit", hour12: true, }).format(new Date(`1970-01-01 ${course.hora_inicio}`))}</Table.Cell>
                                    <Table.Cell className="text-center">{Intl.DateTimeFormat('es-CO', { hour: "numeric", minute: "2-digit", hour12: true, }).format(new Date(`1970-01-01 ${course.hora_fin}`))}</Table.Cell>
                                    <Table.Cell className="flex justify-center gap-2">
                                        <Button type="button" title="Editar" icon={faPenToSquare} variant="outline" color="green" onClick={() => {
                                            handleSelectCourse(course.id_grado);
                                        }} />
                                        <Button type="button" title="Eliminar" icon={faTrash} variant="semi" color="rose" onClick={() => {
                                            handleDeleteCourse(course.id_grado);
                                        }} />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) :
                            (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>No hay cursos registrados</Table.Cell>
                                </Table.Row>
                            )}

                    </Table.Tbody>
                </Table.Table>
                <Table.Pagination totalPages={totalPages} currentPage={page} onPageChange={(page) => navigate({ to: "/dashboard/courses", search: { page } })} />
            </Table>


            <Modal isOpen={isOpen} title={`${mode === "create" ? "Crear" : "Actualizar"} curso`} description={`${mode === "create" ? "Aquí puedes crear un nuevo curso" : "Aquí puedes actualizar el curso seleccionado"}`} closeModal={closeModal}  >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <form.Field
                            name="course"
                            children={(field) => (
                                <InputModal
                                    col="col2"
                                    label="Grado (ej: 10-2)"
                                    type="text"
                                    placeholder="Escribe el grado."
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El grado es requerido";
                                    if (!/^(?:[0-9]|1[01])-\d+$/.test(value)) return "El grado debe tener el formato correcto (ej: 10-2)";
                                }
                            }}
                        />

                        <form.Field
                            name="start_time"
                            children={(field) => (
                                <InputModal
                                    step="1"
                                    label="Hora inicio de reparto"
                                    type="time"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);

                                        const hours = new Date(`1970-01-01 ${e.target.value}`).getHours();

                                        form.setFieldValue("turn", hours < 12 ? "Mañana" : "Tarde");
                                    }}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "La hora de inicio de reparto es requerida";
                                }
                            }}
                        />

                        <form.Field
                            name="end_time"
                            children={(field) => (
                                <InputModal
                                    step="1"
                                    label="Hora fin de reparto"
                                    type="time"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                />
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "La hora de fin de reparto es requerida";
                                }
                            }}
                        />

                        <form.Field
                            name="turn"
                            children={(field) => (
                                <SelectModal
                                    disabled
                                    label="Turno"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={field.state.meta.errors?.[0]}
                                >
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
                                </SelectModal>
                            )}
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value.trim()) return "El turno es requerido";
                                }
                            }}
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
                                <Button
                                    type="submit"
                                    title={isSubmitting ? "Guardando..." : mode === "create" ? "Guardar" : "Actualizar"}
                                    icon={faFloppyDisk}
                                    color="green"
                                    disabled={!canSubmit} />
                            )}
                        />
                    </Modal.Footer>
                </form>

            </Modal >
        </>
    );
}