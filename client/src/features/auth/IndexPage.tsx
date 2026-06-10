import { useForm } from "@tanstack/react-form";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loginUser, verifyToken } from "@/features/auth/api/users";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { Toast } from "@/shared/ui/alerts";
import useAxiosError from "@/shared/hooks/useAxiosError";
import { useUser } from "@/shared/hooks/useUser";

export default function Index() {
    const [serverError, setServerError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const { handleError } = useAxiosError();
    const { startLoading, stopLoading } = usePageLoader();
    const { setUser, setAccessToken } = useUser();

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await verifyToken();

            if (response.status === 200 && response.data?.redirect) {
                navigate({ to: response.data.redirect });
            }
        } catch (error) {

            if (isAxiosError(error)) {
                if (error.response?.data.notFound) {
                    return;
                }
            }
            handleError(error);
        } finally {
            setTimeout(() => stopLoading(), 1000);
        }
    }, [startLoading, stopLoading, navigate, handleError]);



    const form = useForm({
        defaultValues: {
            document: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            try {
                const response = await loginUser(value);

                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: response.data.message,
                    });
                    setUser(response.data.user);
                    setAccessToken(response.data.accessToken);
                    navigate({ to: response.data.redirect });
                }
            } catch (error) {
                if (isAxiosError(error)) {
                    setServerError(error.response?.data?.message || "Error desconocido.");
                }
            }
        }
    });

    useEffect(() => {
        onLoad();
    }, [onLoad]);


    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-green-100/80 to-emerald-200 flex items-center justify-center p-4">
            {/* Card principal con efecto glass y bordes redondeados */}
            <div className="glass-card w-full max-w-md rounded-4xl border border-white/60 shadow-soft p-8 backdrop-blur-sm bg-[#faf8f5e0]">

                {/* Encabezado con ícono y título */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 shadow-md mb-4">
                        {/* Puedes usar un ícono de Nutri Check o un logo */}
                        <img src="/logoNutriCheck.png" alt="logoNutriCheck" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 tracking-tight">Nutri Check</h1>
                    <p className="text-green-600/80 text-sm mt-1 font-medium">Área Administrativa</p>
                </div>

                {/* Formulario */}
                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-5">
                    {serverError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Campo Documento */}
                    <form.Field
                        name="document"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value.trim()) return "El campo es requerido";
                                if (value.length < 4) return "Debe tener al menos 4 caracteres";
                                if (!/^[a-zA-Z0-9]+$/.test(value)) return "Solo letras y números";
                            }
                        }}
                        children={(field) => (
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-green-800 ml-1">
                                    Documento
                                </label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ingrese el número de documento"
                                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-white/60 shadow-soft text-green-900 placeholder-green-600/50 outline-none focus:bg-white focus:border-green-500/50 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                                />
                                {field.state.meta.errors?.[0] && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">{field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Campo Contraseña */}
                    <form.Field
                        name="password"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value.trim()) return "El campo es requerido";
                                if (value.length < 8) return "Debe tener al menos 8 caracteres";
                            }
                        }}
                        children={(field) => (
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-green-800 ml-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-white/60 shadow-soft text-green-900 placeholder-green-600/50 outline-none focus:bg-white focus:border-green-500/50 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                                />
                                {field.state.meta.errors?.[0] && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">{field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Botón de envío */}
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-2xl shadow-soft transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        )}
                    />
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-green-600/60 mt-8">
                    © {new Date().getFullYear()} Nutri Check – Todos los derechos reservados
                </p>
                {/* <p className="text-center text-xs text-green-600/60 mt-8">
                    Desarrollado por: <a href="https://www.instagram.com/jncamilo.dev" className="font-bold text-green-600 hover:text-green-700 hover:underline transition-all duration-300" target="_blank" >Juan Camilo Osorio</a>
                </p> */}
            </div>
        </div>
    );
}
