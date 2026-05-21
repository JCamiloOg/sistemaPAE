import { Outlet } from "@tanstack/react-router";
import SidebarAdmin from "@/features/dashboard/components/Sidebar";
export default function DashboardLayout() {

    return (
        <>
            <div className="bg-linear-to-br from-green-50 to-white  h-screen">
                <SidebarAdmin />
                <div className="md:ml-57 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
