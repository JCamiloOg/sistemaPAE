import {
    faBell,
    faBoxOpen,
    faCalendarXmark,
    faChartLine,
    faClipboardCheck,
    faUserGraduate,
    faUsers,
    faCircleInfo,
    faTriangleExclamation,
    faBullhorn,
    faUser,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDashboard } from "../api/dashboard";
import useAxiosError from "@/shared/hooks/useAxiosError";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { useCallback, useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import type { AssistanceForWeek, LastIngresedStudents, NotificationForWeek, StudentsWithMoresOffenses, UpcomingDistribution } from "../types/dashboard";
import { useNavigate } from "@tanstack/react-router";
import Popover from "@/shared/components/Popover";
import { diffDate } from "@/shared/lib/dateFormat";
import Button from "@/shared/components/Button";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const notificationStyles = {
    General: {
        bg: "bg-emerald-50/80 border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-100/20",
        icon: faBullhorn,
        iconBg: "bg-emerald-100/80",
        iconColor: "text-emerald-700",
        badgeBg: "bg-emerald-100 text-emerald-800",
        titleColor: "text-emerald-950",
        textColor: "text-emerald-800/90",
    },
    Información: {
        bg: "bg-blue-50/80 border-blue-100 hover:border-blue-200 hover:shadow-blue-100/20",
        icon: faCircleInfo,
        iconBg: "bg-blue-100/80",
        iconColor: "text-blue-700",
        badgeBg: "bg-blue-100 text-blue-800",
        titleColor: "text-blue-950",
        textColor: "text-blue-800/90",
    },
    Urgente: {
        bg: "bg-rose-50/80 border-rose-100 hover:border-rose-200 hover:shadow-rose-100/20",
        icon: faTriangleExclamation,
        iconBg: "bg-rose-100/80",
        iconColor: "text-rose-700",
        badgeBg: "bg-rose-100 text-rose-800 animate-pulse",
        titleColor: "text-rose-950",
        textColor: "text-rose-800/90",
    }
};

const labels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

export default function DashboardPage() {
    const [totalAssistance, setTotalAssistance] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOffenses, setTotalOffenses] = useState(0);
    const [studentsWithMoresOffenses, setStudentsWithMoresOffenses] = useState<StudentsWithMoresOffenses[]>([]);
    const [assistanceForWeek, setAssistanceForWeek] = useState<AssistanceForWeek[]>([]);
    const [upComingDistribution, setUpComingDistribution] = useState<UpcomingDistribution[]>([]);
    const [notificationsForWeek, setNotificationsForWeek] = useState<NotificationForWeek[]>([]);
    const [lastIngresedStudents, setLastIngresedStudents] = useState<LastIngresedStudents[]>([]);


    const { startLoading, stopLoading } = usePageLoader();
    const { handleError } = useAxiosError();
    const navigate = useNavigate();

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getDashboard();

            if (response.status === 200) {
                setTotalAssistance(response.data.totalAssistanceToday);
                setTotalStudents(response.data.totalStudents);
                setTotalUsers(response.data.totalUsers);
                setTotalOffenses(response.data.totalOffensesToday);
                setStudentsWithMoresOffenses(response.data.studentsWithMoresOffenses);
                setAssistanceForWeek(response.data.assistanceForWeek);
                setUpComingDistribution(response.data.upcomingDistribution);
                setNotificationsForWeek(response.data.notificationsForWeek);
                setLastIngresedStudents(response.data.lastIngresedStudents);
            }
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };


    const data = {
        labels,
        datasets: [
            {
                label: "Semana actual",
                data: assistanceForWeek.map(week => week.semana_actual),
                backgroundColor: 'rgb(1, 102, 48)'
            },
            {
                label: "Semana pasada",
                data: assistanceForWeek.map(week => week.semana_pasada),
                backgroundColor: 'rgb(219, 252, 231)'
            }
        ]
    };


    return (
        <>

            {/* Content */}
            <section className="space-y-6">

                {/* HEADER */}
                <div
                    className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    data-aos="fade-up"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-green-900">
                            Dashboard PAE
                        </h1>

                        <p className="text-sm text-green-600 mt-1">
                            Resumen general del sistema de alimentación escolar
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl text-sm">
                            {Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date())}
                        </div>

                        <Popover
                            customTrigger={
                                <button className="relative p-3 rounded-2xl bg-white/70 border border-white/60 shadow-soft transition cursor-pointer hover:shadow-soft hover:scale-105">
                                    <FontAwesomeIcon
                                        icon={faBell}
                                        className="text-green-800"
                                    />
                                    {
                                        notificationsForWeek.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                                {notificationsForWeek.length}
                                            </span>
                                        )
                                    }
                                </button>
                            }
                            panelClassName="w-150"
                            title="Notificaciones recientes"
                            placement="bottom-end"
                        >
                            {
                                notificationsForWeek.length > 0 ? (
                                    <>
                                        {
                                            notificationsForWeek.map((notification, index) => {
                                                const style = notificationStyles[notification.tipo] || notificationStyles.General;
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`flex gap-4 p-4 mb-3 last:mb-0 rounded-[22px] border ${style.bg} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md shadow-sm`}
                                                    >
                                                        {/* Icon Badge */}
                                                        <div className={`shrink-0 w-11 h-11 rounded-[16px] flex items-center justify-center ${style.iconBg} border border-white/50 shadow-inner`}>
                                                            <FontAwesomeIcon icon={style.icon} className={`text-base ${style.iconColor}`} />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${style.badgeBg}`}>
                                                                        {notification.tipo}
                                                                    </span>
                                                                    <h4 className={`font-bold text-sm ${style.titleColor} truncate max-w-[180px] sm:max-w-xs`}>
                                                                        {notification.titulo}
                                                                    </h4>
                                                                </div>
                                                                <span className="text-[10px] font-medium text-gray-500 bg-black/5 px-2 py-0.5 rounded-md">
                                                                    {`${diffDate(new Date(), new Date(notification.fecha), false, true)}`}
                                                                </span>
                                                            </div>

                                                            <p className={`text-xs leading-relaxed ${style.textColor} mb-2.5 wrap-break-words whitespace-pre-line`}>
                                                                {notification.mensaje}
                                                            </p>

                                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 border-t border-black/5 pt-2">
                                                                <FontAwesomeIcon icon={faUser} className="text-gray-400/80" />
                                                                <span className="font-semibold text-gray-600">Por:</span>
                                                                <span className="text-gray-700 font-medium">{notification.usuario}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }

                                        <Button
                                            title="Ver todas"
                                            icon={faArrowRight}
                                            color="green"
                                            variant="outline"
                                            size="md"
                                            type="button"
                                            onClick={() => navigate({ to: "/dashboard/notifications" })}
                                        />
                                    </>
                                ) : (
                                    <div className="bg-white/80 rounded-3xl p-4 border border-white/60 text-center">
                                        <p className="text-sm text-green-700 font-medium">
                                            No hay notificaciones generales.
                                        </p>
                                    </div>
                                )
                            }
                        </Popover>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    {/* CARD */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-green-500">
                                    Estudiantes
                                </p>

                                <h2 className="text-4xl font-bold text-green-900 mt-2">
                                    {totalStudents}
                                </h2>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faUserGraduate}
                                    className="text-green-700 text-xl"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-green-500 mt-4">
                            Total matriculados
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-green-500">
                                    Asistencia hoy
                                </p>

                                <h2 className="text-4xl font-bold text-green-900 mt-2">
                                    {totalAssistance}
                                </h2>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faClipboardCheck}
                                    className="text-green-700 text-xl"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-green-500 mt-4">
                            Cobertura del día
                        </p>
                    </div>
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-green-500">
                                    Inasistencia hoy
                                </p>

                                <h2 className="text-4xl font-bold text-red-500 mt-2">
                                    {totalOffenses}
                                </h2>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faCalendarXmark}
                                    className="text-red-700 text-xl"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-red-400 mt-4">
                            Cobertura del día
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-green-500">
                                    Usuarios
                                </p>

                                <h2 className="text-4xl font-bold text-green-900 mt-2">
                                    {totalUsers}
                                </h2>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="text-green-700 text-xl"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-green-500 mt-4">
                            Usuarios activos
                        </p>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* ASISTENCIA POR GRADO */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-green-900">
                                    Asistencia comparativa por día de la semana
                                </h3>

                                <p className="text-xs text-green-500">
                                    Resumen semanal
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faChartLine}
                                    className="text-green-700"
                                />
                            </div>
                        </div>

                        {/* PLACEHOLDER CHART */}
                        <div className="h-72 rounded-3xl border border-dashed border-green-200 flex items-center justify-center text-green-400">
                            <Bar data={data} options={options} />
                        </div>
                    </div>

                    {/* HISTORIAL */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-green-900">
                                    Siguientes repartos del PAE
                                </h3>

                                <p className="text-xs text-green-500">
                                    Proximos repartos
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faBoxOpen}
                                    className="text-green-700"
                                />
                            </div>
                        </div>

                        {/* PLACEHOLDER CHART */}
                        <div className="h-72 rounded-3xl space-y-5  text-green-400 overflow-y-auto">
                            {
                                upComingDistribution.length > 0 ? (
                                    upComingDistribution.map((course, index) => (
                                        <div
                                            onClick={() => navigate({ to: "/dashboard/assistance", search: { course: course.id_grado } })}
                                            className="bg-white/80 rounded-3xl cursor-pointer hover:-translate-y-1 p-4 border border-white/60 transition-all duration-300 hover:bg-green-100"
                                            key={index}>
                                            <div className="flex justify-between">
                                                <h4 className="font-semibold text-green-900">
                                                    Grado: {course.grado}
                                                </h4>

                                                <span className="text-xs text-green-500">
                                                    {course.estado === "En curso" ? "En curso" : `En ${diffDate(new Date(), course.hora_inicio, true)} minutos`}
                                                </span>
                                            </div>

                                        </div>))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-green-500">
                                            No hay repartos próximos
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div >

                {/* TABLES */}
                < div className="grid grid-cols-1 xl:grid-cols-2 gap-6" >

                    {/* TOP INASISTENCIAS */}
                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft" >

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-green-900">
                                Estudiantes con más faltas mensuales
                            </h3>

                            <p className="text-xs text-green-500">
                                Riesgo de ausentismo
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-[0.18em] text-green-500">
                                        <th className="px-4 py-2">
                                            Documento
                                        </th>

                                        <th className="px-4 py-2">
                                            Nombre completo
                                        </th>

                                        <th className="px-4 py-2">
                                            Grado
                                        </th>

                                        <th className="px-4 py-2">
                                            Faltas
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm text-green-800">
                                    {
                                        studentsWithMoresOffenses && studentsWithMoresOffenses.length > 0 ?
                                            (
                                                studentsWithMoresOffenses.map((student, index) => (
                                                    <tr key={index} className="rounded-3xl bg-white/85 shadow-sm">
                                                        <td className="px-4 py-4 rounded-l-3xl">
                                                            {student.documento}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {student.nombreCompleto}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {student.grado}
                                                        </td>

                                                        <td className="px-4 py-4 rounded-r-3xl text-red-500 font-semibold">
                                                            {student.total}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="rounded-3xl bg-white/85 shadow-sm">
                                                    <td colSpan={4} className="px-4 py-4 rounded-l-3xl text-center">
                                                        Sin estudiantes con riesgo de ausentismo
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass-card rounded-4xl bg-[#faf8f5e0] border border-white/60 p-6 shadow-soft" >
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-green-900">
                                Últimos estudiantes registrados en el PAE
                            </h3>

                            <p className="text-xs text-green-500">
                                Últimos estudiantes registrados
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-[0.18em] text-green-500">
                                        <th className="px-4 py-2">
                                            Documento
                                        </th>

                                        <th className="px-4 py-2">
                                            Nombre completo
                                        </th>

                                        <th className="px-4 py-2">
                                            Grado
                                        </th>

                                        <th className="px-4 py-2">
                                            Tiempo de ingreso
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm text-green-800">
                                    {
                                        lastIngresedStudents && lastIngresedStudents.length > 0 ?
                                            (
                                                lastIngresedStudents.map((student, index) => (
                                                    <tr key={index} className="rounded-3xl bg-white/85 shadow-sm">
                                                        <td className="px-4 py-4 rounded-l-3xl">
                                                            {student.documento}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {student.nombreCompleto}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {student.grado}
                                                        </td>

                                                        <td className="px-4 py-4 rounded-r-3xl">
                                                            {`${diffDate(new Date(), new Date(student.create_at), false, true)} `}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="rounded-3xl bg-white/85 shadow-sm">
                                                    <td colSpan={4} className="px-4 py-4 rounded-l-3xl text-center">
                                                        Sin estudiantes registrados
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            </section >
        </>
    );
}