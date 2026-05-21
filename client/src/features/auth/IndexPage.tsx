import { useForm } from "@tanstack/react-form";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loginUser, verifyToken } from "@/features/auth/api/users";
import Input from "@/shared/components/Input";
import { usePageLoader } from "@/shared/hooks/usePageLoader";
import { Toast } from "@/shared/ui/alerts";
import useAxiosError from "@/shared/hooks/useAxiosError";

export default function Index() {
    const [serverError, setServerError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const { handleError } = useAxiosError();
    const { startLoading, stopLoading } = usePageLoader();

    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await verifyToken();


            if (response.status === 200 && response.data?.redirect) {
                navigate({ to: response.data.redirect });
            }
        } catch (error) {
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
        onSubmit: async ({ value, formApi }) => {
            try {
                const response = await loginUser(value);


                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: response.data.message,
                    });
                    navigate({ to: response.data.redirect });
                }
            } catch (error) {
                if (isAxiosError(error)) {
                    if (error.response?.data?.errors?.field) {
                        formApi.setErrorMap({
                            onSubmit: {
                                fields: {
                                    [error.response?.data?.errors?.field]: error.response?.data?.errors?.message
                                }
                            }
                        });
                    } else {
                        setServerError(error.response?.data?.message || "Error desconocido.");
                    }
                }
            }
        }
    });

    useEffect(() => {
        onLoad();
    }, [onLoad]);


    return (
        <>
            <div className="bg-linear-to-br from-green-100 to-green-300 min-h-screen flex items-center justify-center">

                <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">

                    {/* Título */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-green-700">Nutri Check</h1>
                        <p className="text-gray-500 text-sm mt-2">Área Administrativa</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-5" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}>
                        {serverError && <p className="text-red-500 text-sm font-bold mt-1">{serverError}</p>}
                        {/* Usuario */}
                        <div>
                            <form.Field
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value.trim()) return "El campo es requerido";
                                        if (value.length < 4) return "El campo debe tener al menos 4 caracteres";
                                        if (!/^[a-zA-Z0-9]+$/.test(value)) return "El campo debe contener solo letras y números";
                                    }
                                }}
                                name="document"
                                children={(field) => (
                                    <Input
                                        label="Documento"
                                        placeholder="Ingrese el número de documento"
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        error={field.state.meta.errors?.[0]}
                                    />
                                )}
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <form.Field
                                name="password"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value.trim()) return "El campo es requerido";
                                        if (value.length < 8) return "El campo debe tener al menos 8 caracteres";
                                    }
                                }}
                                children={(field) => (
                                    <Input
                                        label="Contraseña"
                                        placeholder="Ingrese su contraseña"
                                        type="password"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        error={field.state.meta.errors?.[0]}
                                    />
                                )}
                            />
                        </div>

                        {/* Botón */}
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <>
                                    <button
                                        disabled={!canSubmit || isSubmitting}
                                        type="submit"
                                        className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                                    >
                                        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                                    </button>
                                </>
                            )}

                        />
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        © {new Date().getFullYear()} Nutri Check - Todos los derechos reservados
                    </p>

                </div>
            </div>
        </>
    );
}
