import useSidebar from "@/shared/hooks/useSidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import { logout } from "@/features/auth/api/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faChartLine, faClipboardList, faPeopleRoof, faRightFromBracket, faUserGraduate, faUsers, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Toast } from "@/shared/ui/alerts";

export default function SidebarAdmin() {
    const { isOpen, toggleSidebar } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await logout();

            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: res.data.message,
                });
                navigate({ to: "/" });
            }
        } catch {
            Toast.fire({
                icon: "error",
                title: "Error al cerrar sesión",
            });
        };
    };

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
                    className="fixed top-4 left-4 z-50 md:hidden bg-green-800 text-white p-3 rounded-xl shadow-soft"
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

                            <button onClick={toggleSidebar} className="md:hidden text-green-800">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <nav className="space-y-3 text-sm">

                            <Link to="/dashboard" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faChartLine} />
                                Dashboard
                            </Link>

                            <Link to="/dashboard/users" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faUsers} />
                                Usuarios
                            </Link>

                            <Link to="/dashboard/assistance" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faClipboardList} />
                                Asistencia
                            </Link>

                            <Link to="/dashboard/students" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faUserGraduate} />
                                Estudiantes
                            </Link>
                            <Link to="/dashboard/courses" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faPeopleRoof} />
                                Grados
                            </Link>
                            <Link to="/dashboard/notifications" activeOptions={{ exact: true, includeSearch: false }} inactiveProps={{ className: "text-green-800 hover:bg-green-100" }} activeProps={{ className: "bg-green-800 text-white" }} className="flex items-center gap-3 px-4 py-3 rounded-xl transition">
                                <FontAwesomeIcon icon={faBell} />
                                Notificaciones
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <button onClick={handleLogout}
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
