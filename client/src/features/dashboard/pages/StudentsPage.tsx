/* Components */
import Button from "@/shared/components/Button";
import InputModal from "@/shared/components/modal/InputModal";
import Modal from "@/shared/components/modal/Modal";
import SelectModal from "@/shared/components/modal/SelectModal";
import GlassRadioGroup from "@/shared/components/RadioButtons";
import Table from "@/shared/components/table/Table";
import { MySwal, Toast } from "@/shared/ui/alerts";
import { faFloppyDisk, faPenToSquare, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

/* Hooks */
import useModal from "@/shared/hooks/useModal";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import useAxiosError from "@/shared/hooks/useAxiosError";

/* Services */
import { getStudents, insertStudent, updateStatusStudent, updateStudent } from "@/features/dashboard/api/students";

/* Types */
import type { Student, StudentDB, StudentStatus } from "@/features/dashboard/types/assistance";
import type { CourseDB } from "../types/course";

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentDB[]>([]);
    const [courses, setCourses] = useState<CourseDB[]>([]);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<Omit<Student, "status"> | null>(null);

    const { startLoading, stopLoading } = usePageLoader();
    const { isOpen, closeModal, openModal } = useModal();
    const { page, course } = useSearch({ from: "/dashboard/students" });
    const navigate = useNavigate();
    const { handleError } = useAxiosError();

    const statusOptions: { value: StudentStatus, label: string }[] = [
        { label: "Matriculado", value: "Matriculado" },
        { label: "Retirado", value: "Retirado" },
        { label: "Cancelado", value: "Cancelado" },
    ];

    const form = useForm({
        defaultValues: selectedStudent || {
            document: "",
            name: "",
            lastName: "",
            course: course || "",
        },
        onSubmit: async ({ value }) => {
            try {
                let response;

                if (mode === "create") response = await insertStudent(value);
                else response = await updateStudent(value);

                if (response?.status === 200 || response?.status === 201) {
                    Toast.fire({
                        icon: "success",
                        title: response?.data.message,
                    });
                    closeModal();
                    toggleCourse();
                    startLoading();
                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }
        }
    });

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getStudents();

            if (response.status === 200) setCourses(response.data.courses);

        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    }, [startLoading, stopLoading, handleError]);

    useEffect(() => {
        // eslint-disable-next-line
        onLoad();
    }, [onLoad]);

    const handleChangeCourse = (id: number) => {
        if (!id) {
            navigate({ to: "/dashboard/students" });
            setStudents([]);
            setTotalPages(1);
        }

        navigate({ to: "/dashboard/students", search: { course: id, page: 1 } });
    };

    const toggleCourse = useCallback(async () => {
        startLoading();
        try {
            setStudents([]);

            const response = await getStudents(page, course);

            if (response.status === 200) {
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    }, [course, page, startLoading, stopLoading, handleError]);


    const selectEditStudent = (id: string) => {
        const student = students.map((student) => ({
            document: student.documento,
            name: student.nombre,
            lastName: student.apellido,
            course: student.id_grado,

        })).filter((student) => student.document === id)[0];

        setSelectedStudent(student);
        setMode("update");
        openModal();
    };

    useEffect(() => {
        setTimeout(() => {
            if (!isOpen) {
                form.reset({
                    document: "",
                    name: "",
                    lastName: "",
                    course: "",
                });
                setSelectedStudent(null);
            }
        }, 200);
    }, [isOpen, form]);

    const handleChangeStatusStudent = (id: string, status: StudentStatus) => {
        MySwal.fire({
            title: `¿Estas seguro de cambiar el estatus del estudiante a ${status}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: 'Sí, Cambiar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: '#faf8f5',
            color: '#3f3125',
            confirmButtonColor: '#016630',
            cancelButtonColor: '#5d625f',


        }).then(async (result) => {
            if (!result.isConfirmed) return;

            startLoading();
            try {
                const response = await updateStatusStudent(id, status);

                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: response.data.message,
                    });

                    toggleCourse();

                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }
        });
    };

    useEffect(() => {
        toggleCourse();
    }, [toggleCourse]);
    return (
        <>
            <div className="p-6">

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-green-900">
                        Grupos disponibles
                    </h2>
                    <p className="text-sm text-green-600">
                        Selecciona un grado para ver los estudiantes matriculados en el grado
                    </p>

                    <div className="flex flex-col md:gap-4 mt-4 md:w-xl">
                        <select
                            value={course ? course : ""}
                            onChange={(e) => handleChangeCourse(parseInt(e.target.value))}
                            className="w-full appearance-none bg-white border border-green-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 pr-10 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                        hover:border-green-400 transition"

                        >
                            <option value="">Seleccione un curso</option>

                            {courses.map((course) => (
                                <option key={course.id_grado} value={course.id_grado}>
                                    {course.grado}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Table>
                    <Table.Header title="Listado de estudiantes" description="Aqui se muestran todos los estudiantes pertenecientes al grado seleccionado" action={<Button type="button" title="Crear estudiante" icon={faPlus} color="green" onClick={() => {
                        setMode("create");
                        openModal();
                    }} />} />

                    <Table.Table>
                        <Table.Thead>
                            <Table.Row head>
                                <Table.Cell className="font-bold" rounded="left">Documento</Table.Cell>
                                <Table.Cell className="font-bold">Nombre</Table.Cell>
                                <Table.Cell className="font-bold">Apellido</Table.Cell>
                                <Table.Cell className="font-bold">Grado</Table.Cell>
                                <Table.Cell className="font-bold text-center">Estado</Table.Cell>
                                <Table.Cell className="text-right font-bold">Acciones</Table.Cell>
                            </Table.Row>
                        </Table.Thead>

                        <Table.Tbody>
                            {
                                course ? (
                                    students && students.length > 0 ?
                                        students.map((student, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell className="font-medium" rounded="left">{student.documento}</Table.Cell>
                                                <Table.Cell>{student.nombre}</Table.Cell>
                                                <Table.Cell>{student.apellido}</Table.Cell>
                                                <Table.Cell>{student.grado}</Table.Cell>
                                                <Table.Cell>
                                                    <GlassRadioGroup<StudentStatus> options={statusOptions} value={student.estado} onChange={(value) => handleChangeStatusStudent(student.documento, value)} />
                                                </Table.Cell>
                                                <Table.Cell rounded="right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button title="Editar" type="button" onClick={() => selectEditStudent(student.documento)} icon={faPenToSquare} color="green" size="sm" variant="outline" />
                                                        {/* <Button title="Eliminar" type="button" onClick={() => handleChangeStatusUser(user.documento)} icon={faTrashCan} color="rose" size="sm" variant="semi" /> */}

                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                        :
                                        <Table.Row>
                                            <Table.Cell colSpan={6} className="text-center">No se encontraron estudiantes</Table.Cell>
                                        </Table.Row>
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="text-center">Seleccione un grado</Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Tbody>
                    </Table.Table>
                    <Table.Pagination totalPages={totalPages} currentPage={page} onPageChange={(page) => navigate({ to: `/dashboard/students`, search: { course, page } })} />
                </Table>
            </div>

            <Modal isOpen={isOpen} title={mode === "create" ? "Crear estudiante" : "Editar estudiante"} description={mode === "create" ? "Aqui puedes crear un estudiante" : "Aqui puedes editar un estudiante"} closeModal={closeModal}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <form.Field
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value) return "El documento es obligatorio";
                                    if (value.length < 8) return "El documento debe tener al menos 8 caracteres";
                                    if (value.length > 20) return "El documento debe tener máximo 20 caracteres";
                                    if (!/^\d+$/.test(value)) return "El documento solo debe contener números";
                                }
                            }}
                            name="document"
                            children={(field) => (
                                <InputModal
                                    col="col2"
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
                                    if (!value) return "El nombre es obligatorio";
                                    if (value.length < 4) return "El nombre debe tener al menos 3 caracteres";
                                    if (value.length > 40) return "El nombre debe tener máximo 50 caracteres";
                                    if (!/^[a-zA-Z ]+$/.test(value)) return "El nombre solo debe contener letras";
                                }
                            }}
                            name="name"
                            children={(field) => (
                                <InputModal
                                    col="col2"
                                    label="Nombre"
                                    placeholder="Ingrese el nombre"
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
                                    if (!value) return "El apellido es obligatorio";
                                    if (value.length < 4) return "El apellido debe tener al menos 3 caracteres";
                                    if (value.length > 40) return "El apellido debe tener máximo 50 caracteres";
                                    if (!/^[a-zA-Z ]+$/.test(value)) return "El apellido solo debe contener letras";
                                }
                            }}
                            name="lastName"
                            children={(field) => (
                                <InputModal
                                    col="col2"
                                    label="Apellido"
                                    placeholder="Ingrese el apellido"
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
                                    if (!value) return "El grado es obligatorio";
                                }
                            }}
                            name="course"
                            children={(field) => (
                                <SelectModal label="Grado" error={field.state.meta.errors?.[0]} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                                    <option value="" selected>Seleccione un grado...</option>
                                    {
                                        courses.map((course) => (
                                            <option value={course.id_grado} key={course.id_grado}>{course.grado}</option>
                                        ))
                                    }
                                </SelectModal>
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