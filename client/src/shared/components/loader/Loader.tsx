import { usePageLoader } from "../../hooks/usePageLoader";

export default function Loader() {
    const { loading } = usePageLoader();

    if (!loading) return null;


    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="flex flex-col items-center gap-4">

                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

                {/* Texto */}
                <p className="text-green-700 font-semibold">
                    Cargando...
                </p>

            </div>

        </div>
    );
}