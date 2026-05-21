/* Components */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "@/shared/components/Button";
import { MySwal, Toast } from "@/shared/ui/alerts";


/* Hooks */
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { usePageLoader } from "@/shared/hooks/usePageLoader";

/* Services */
import { getAllCourses } from "../api/courses";
import { createAssistance, updateAssistance } from "@/features/dashboard/api/assistance";

/* Types */
import type { Assistance, StudentDB } from "@/features/dashboard/types/assistance";
import type { CourseDB } from "@/features/dashboard/types/course";

/* Utils */
import { sqlDateFormat } from "@/shared/lib/dateFormat";
import ToggleButton from "@/shared/components/ToggleButton";
import { getStudentsByCourse } from "@/features/dashboard/api/students";
import useAxiosError from "@/shared/hooks/useAxiosError";


export default function Assistance() {
    const [students, setStudents] = useState<StudentDB[] | []>([]);
    const [assistance, setAssistance] = useState<Assistance[] | []>([]);
    const { startLoading, stopLoading } = usePageLoader();
    const [registeredAssistance, setRegisteredAssistance] = useState(false);
    const isMobile = useIsMobile();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { handleError } = useAxiosError();
    const search = useSearch({ from: "/dashboard/assistance" });

    const [courses, setCourses] = useState<CourseDB[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<CourseDB | null>(null);

    const handleChangeCourse = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value)) {
            navigate({ to: "/dashboard/assistance" });
        } else {
            navigate({
                to: "/dashboard/assistance",
                search: {
                    ...search,
                    course: value,
                }
            });
        }
    };

    const toggleCourse = useCallback(async (id: number, date?: string) => {
        startLoading();
        try {
            if (isNaN(id)) {
                setStudents([]);
                setAssistance([]);
                setSelectedCourse(null);
                return;
            }

            const response = await getStudentsByCourse(id, date ? date : '');

            if (response.status === 200) {
                setStudents(response.data.students);
                if (response.data.message) {
                    Toast.fire({
                        icon: "info",
                        title: response.data.message,
                    });
                    setAssistance(response.data.students.map((student) => ({ documento: student.documento, estado: student.asistencia == 'Asistió' ? true : false, id_asistencia: student.id_asistencia })));
                    setRegisteredAssistance(true);
                } else {
                    setAssistance(response.data.students.map((student) => ({ documento: student.documento, estado: false })));
                    setRegisteredAssistance(false);
                }

                setSelectedCourse(courses.find((course) => course.id_grado === id) || null);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 300);
        }
    }, [startLoading, stopLoading, courses, handleError]);

    const toggleAssistance = (documento: string) => {
        setAssistance((prevAssistance) =>
            prevAssistance.map((student) =>
                student.documento === documento
                    ? { ...student, estado: !student.estado }
                    : student
            )
        );
    };


    useEffect(() => {
        const onLoad = async () => {
            startLoading();
            try {
                const response = await getAllCourses();

                if (response.status === 200) setCourses(response.data.courses);

            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => stopLoading(), 300);
            }

        };

        onLoad();
    }, [startLoading, stopLoading, navigate, handleError]);

    const saveAssistance = async () => {
        MySwal.fire({
            title: `¿Estas seguro de guardar la asistencia?`,
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
            try {

                if (!result.isConfirmed) return;
                setIsSubmitting(true);
                const res = await createAssistance(assistance);

                if (res.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: res.data.message,
                    });

                    setRegisteredAssistance(true);
                    toggleCourse(selectedCourse?.id_grado || 0);
                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => {
                    setIsSubmitting(false);
                    stopLoading();
                }, 300);
            }
        });
    };

    const modifyAssistance = async () => {
        MySwal.fire({
            title: `¿Estas seguro de modificar la asistencia?`,
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
            try {
                if (!result.isConfirmed) return;

                setIsSubmitting(true);
                const res = await updateAssistance(assistance);

                if (res.status === 200) {
                    Toast.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                handleError(error);
            } finally {
                setTimeout(() => {
                    setIsSubmitting(false);
                    stopLoading();
                }, 300);
            }
        });
    };

    useEffect(() => {
        if (!search.course) return;

        const id = parseInt(search.course);

        if (isNaN(id)) return;

        // eslint-disable-next-line
        toggleCourse(id, search.date);

    }, [search.course, search.date, toggleCourse]);

    return (
        <>
            <div className="flex-1 p-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-green-900">
                        Control de Asistencia
                    </h1>
                    <p className="text-sm text-green-600">
                        Gestiona la asistencia de los estudiantes
                    </p>
                </div>

                {/* Card */}

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-green-900">
                        Grupos disponibles
                    </h2>
                    <p className="text-sm text-green-600">
                        Selecciona un curso para ver la asistencia
                    </p>

                    <div className="flex flex-col md:gap-4 mt-4">
                        <label className="block text-sm font-medium text-green-900 mb-1">
                            Seleccionar curso
                        </label>

                        <div className="md:w-xl">
                            <select
                                value={search.course}
                                onChange={handleChangeCourse}
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

                            {/* Icono */}
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-green-600">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <label className="block text-sm font-medium text-green-900 mb-1 mt-5">
                        Seleccionar una fecha de asistencia <strong>(opcional, si no se selecciona, se toma la fecha actual)</strong>
                    </label>
                    <div className="flex gap-2">
                        <input value={search.date || ""} disabled={!search.course} max={sqlDateFormat(new Date())} onChange={(e) => navigate({ to: "/dashboard/assistance", search: { ...search, date: e.target.value } })} type="date" className="w-xl appearance-none bg-white border border-green-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition mt-3 disabled:opacity-50" />
                        <button title="Eliminar" onClick={() => navigate({ to: "/dashboard/assistance", search: { ...search, date: "" } })} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition mt-3 disabled:opacity-50"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden mt-10 md:overflow-x-hidden overflow-x-auto">
                        {
                            selectedCourse ? (
                                students.length > 0 ? (
                                    !isMobile ? (

                                        <>
                                            <h2 className="my-5 text-lg font-semibold text-green-900 ms-3">Estudiantes del grado {selectedCourse.grado}</h2>
                                            {/* Table */}
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-xs uppercase tracking-wider text-green-700 bg-green-50">
                                                        <th className="px-6 py-4">Documento</th>
                                                        <th className="px-6 py-4">Nombre y Apellido</th>
                                                        {
                                                            registeredAssistance && (
                                                                <th className="px-6 py-4">Fecha y hora de registro</th>
                                                            )
                                                        }
                                                        <th className="px-6 py-4 text-center">Asistencia</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-green-50">
                                                    {students && students.map((student) => (
                                                        <tr
                                                            key={student.documento}
                                                            className="hover:bg-green-50/60 transition"
                                                        >
                                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                                {student.documento}
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {student.nombre}  {student.apellido}
                                                            </td>
                                                            {
                                                                registeredAssistance && student.hora_ingreso && student.fecha && (
                                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                                        {Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(student.fecha))}  {student.hora_ingreso}
                                                                    </td>
                                                                )
                                                            }

                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-center gap-3">


                                                                    {/* Badge */}
                                                                    <span
                                                                        className={`text-xs px-3 py-1 rounded-full font-medium
                        ${student.estado === 'Retirado' ? "bg-red-100 text-red-800" : assistance.find((asistencia) => asistencia.documento === student.documento)?.estado
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-gray-100 text-gray-500"
                                                                            }`}
                                                                    >
                                                                        {student.estado === 'Retirado' ? "Retirado" : student.estado === 'Cancelado' ? "Cancelado" : assistance.find((asistencia) => asistencia.documento === student.documento)?.estado ? "Asistió" : "No asistió"}
                                                                    </span>

                                                                    {/* Toggle */}
                                                                    <ToggleButton
                                                                        onClick={() => toggleAssistance(student.documento)}
                                                                        disabled={student.estado === 'Retirado' || student.estado === 'Cancelado'}
                                                                        active={assistance.find((asistencia) => asistencia.documento === student.documento)?.estado ?? false}
                                                                    >
                                                                    </ToggleButton>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="flex justify-end mt-5 p-4">
                                                {
                                                    registeredAssistance ? (
                                                        <Button disabled={isSubmitting} title={isSubmitting ? "Guardando..." : "Actualizar asistencia"} type="button" icon={faPenToSquare} color="green" size="sm" onClick={modifyAssistance} />
                                                    ) :
                                                        (
                                                            <Button disabled={isSubmitting} title={isSubmitting ? "Guardando..." : "Guardar asistencia"} type="button" icon={faSave} color="green" size="sm" onClick={saveAssistance} />
                                                        )
                                                }
                                            </div>
                                        </>
                                    ) : (
                                        <div className="md:hidden space-y-4 p-3">
                                            {students.map((student) => {
                                                const asistenciaEstado = assistance.find(
                                                    (a) => a.documento === student.documento
                                                )?.estado;

                                                return (
                                                    <div
                                                        key={student.documento}
                                                        className="bg-white rounded-xl border border-green-100 p-4 shadow-sm"
                                                    >
                                                        <p className="text-sm text-gray-500">Documento</p>
                                                        <p className="font-medium">{student.documento}</p>

                                                        <p className="text-sm text-gray-500 mt-2">Nombre</p>
                                                        <p className="font-medium">
                                                            {student.nombre} {student.apellido}
                                                        </p>

                                                        {registeredAssistance && student.fecha && (
                                                            <>
                                                                <p className="text-sm text-gray-500 mt-2">
                                                                    Fecha de registro
                                                                </p>
                                                                <p className="font-medium">
                                                                    {Intl.DateTimeFormat('es', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    }).format(new Date(student.fecha))}{" "}
                                                                    {student.hora_ingreso}
                                                                </p>
                                                            </>
                                                        )}

                                                        <div className="flex items-center justify-between mt-4">
                                                            {/* Badge */}
                                                            <span
                                                                className={`text-xs px-3 py-1 rounded-full font-medium
                        ${student.estado === "Retirado"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : asistenciaEstado
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-gray-100 text-gray-500"
                                                                    }`}
                                                            >
                                                                {student.estado !== "Retirado"
                                                                    ? asistenciaEstado
                                                                        ? "Asistió"
                                                                        : "No asistió"
                                                                    : "Retirado"}
                                                            </span>

                                                            {/* Toggle */}
                                                            <button
                                                                onClick={() =>
                                                                    toggleAssistance(student.documento)
                                                                }
                                                                disabled={student.estado === "Retirado"}
                                                                className={`relative w-14 h-7 flex items-center rounded-full transition
                        ${asistenciaEstado
                                                                        ? "bg-green-600"
                                                                        : "bg-green-200"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`absolute w-6 h-6 bg-white rounded-full shadow transform transition
                            ${asistenciaEstado
                                                                            ? "translate-x-7"
                                                                            : "translate-x-1"
                                                                        }`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                ) :
                                    (
                                        <div className="p-4">
                                            <p className="text-sm text-gray-600">No hay estudiantes en el grado {selectedCourse.grado}.</p>
                                        </div>
                                    )
                            ) : (
                                search.course && search.date ? (
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600">No hay asistencia en la fecha {Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(search.date))}.</p>
                                    </div>
                                ) :
                                    (
                                        <div className="p-4">
                                            <p className="text-sm text-gray-600">Seleccione un grado.</p>
                                        </div>
                                    )

                            )

                        }
                    </div>
                </div>
            </div>
        </>
    );
}
