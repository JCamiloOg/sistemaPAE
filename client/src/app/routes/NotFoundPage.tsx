import { Link } from "@tanstack/react-router";

export function NotFound() {
    return (
        <div className="min-h-screen bg-linear-to-br from-green-100 to-green-300 flex items-center justify-center px-4">

            <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">

                {/* Logo / Nombre */}
                <h1 className="text-2xl font-bold text-green-700 mb-2">
                    Nutri Check
                </h1>

                {/* Código 404 */}
                <h2 className="text-6xl font-extrabold text-green-600 mt-4">
                    404
                </h2>

                {/* Mensaje */}
                <p className="text-gray-500 mt-3">
                    La página que buscas no existe o fue movida.
                </p>

                {/* Botón volver */}
                <Link
                    to="/"
                    className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}