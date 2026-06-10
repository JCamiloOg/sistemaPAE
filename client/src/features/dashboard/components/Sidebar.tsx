import useSidebar from "@/shared/hooks/useSidebar";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { logout } from "@/features/auth/api/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faChartLine, faClipboardList, faPeopleRoof, faRightFromBracket, faUserGraduate, faUsers, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MySwal, Toast } from "@/shared/ui/alerts";
import { useEffect, useRef } from "react";
import { useUser } from "@/shared/hooks/useUser";

export default function SidebarAdmin() {
    const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, setAccessToken } = useUser();

    const navItems = {
        "Administrador": [
            {
                label: "Dashboard",
                icon: faChartLine,
                path: "/dashboard",
            },
            {
                label: "Usuarios",
                icon: faUsers,
                path: "/dashboard/users",
            },
            {
                label: "Asistencia",
                icon: faClipboardList,
                path: "/dashboard/assistance",
            },
            {
                label: "Estudiantes",
                icon: faUserGraduate,
                path: "/dashboard/students",
            },
            {
                label: "Grados",
                icon: faPeopleRoof,
                path: "/dashboard/courses",
            },
            {
                label: "Notificaciones",
                icon: faBell,
                path: "/dashboard/notifications",
            },
        ],
        "Encargado PAE": [
            {
                label: "Dashboard",
                icon: faChartLine,
                path: "/dashboard",
            },
            {
                label: "Asistencia",
                icon: faClipboardList,
                path: "/dashboard/assistance",
            },
            {
                label: "Estudiantes",
                icon: faUserGraduate,
                path: "/dashboard/students",
            },
            {
                label: "Cursos",
                icon: faPeopleRoof,
                path: "/dashboard/courses",
            },
            {
                label: "Notificaciones",
                icon: faBell,
                path: "/dashboard/notifications",
            }
        ],
    };

    const isOpenRef = useRef(isOpen);


    const handleLogout = async () => {
        try {
            const res = await logout();

            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: res.data.message,
                });
                setAccessToken(null);
                setUser(null);
                navigate({ to: "/" });
            }
        } catch {
            Toast.fire({
                icon: "error",
                title: "Error al cerrar sesión",
            });
        };
    };



    const confirmLogout = () => {
        MySwal.fire({
            title: "¿Estas seguro de cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión!',
            cancelButtonText: 'Cancelar',
            background: '#faf8f5',
            color: '#3f3125',
            confirmButtonColor: '#016630',
            cancelButtonColor: '#5d625f',
        }).then((result) => {
            if (result.isConfirmed) handleLogout();
        });
    };

    useEffect(() => {
        if (isOpenRef.current) closeSidebar();
    }, [location.pathname, closeSidebar]);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);


    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 md:hidden bg-green-800 cursor-pointer text-white p-3 rounded-xl shadow-soft"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            )}

            <aside id="sidebar"
                className={`fixed top-0 left-0 h-full w-64 p-4 z-41  transform ${isOpen ? "translate-x-0" : "-translate-x-full"}  md:translate-x-0 transition-transform duration-300`}>

                <div className="glass-card h-full rounded-4xl border border-white/60 shadow-soft p-6 flex flex-col justify-between">

                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-green-900">Dashboard</h2>

                            <button onClick={toggleSidebar} className="md:hidden text-green-800 cursor-pointer">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <nav className="space-y-3 text-sm">
                            {user && navItems[user.role].map((item, index) => (
                                <Link key={index} to={item.path} activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                    <FontAwesomeIcon icon={item.icon} />
                                    {item.label}
                                </Link>
                            ))}

                        </nav>
                    </div>

                    <div>
                        <button onClick={confirmLogout}
                            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-800 text-white hover:bg-green-900 transition">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            Cerrar sesión
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
}
