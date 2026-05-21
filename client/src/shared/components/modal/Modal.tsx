import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
    title: string
    description: string
    children: ReactNode
    isOpen: boolean
    closeModal: () => void
}

export default function Modal({ title, description, children, isOpen = false, closeModal }: Props) {
    const [visible, setVisible] = useState(false);

    // Cuando cambia isOpen, mostramos u ocultamos
    // visible controla si el nodo está montado
    if (isOpen && !visible) {
        setVisible(true);
    }

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setVisible(false); // desmonta el modal después de la animación de salida
        }
    };


    const lockScroll = useCallback(() => document.body.classList.add("overflow-hidden"), []);
    const unlockScroll = useCallback(() => document.body.classList.remove("overflow-hidden"), []);

    const refBackdrop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) lockScroll();
        else unlockScroll();

    }, [lockScroll, unlockScroll, isOpen]);

    useEffect(() => {
        const listener = (e: Event) => { if (e.target === refBackdrop.current) closeModal(); };

        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [refBackdrop, closeModal]);

    if (!visible) return null;

    return (
        <div className={`fixed ${visible ? "flex" : "hidden"} inset-0 z-50 items-center justify-center p-4 `} >
            <div className={`absolute inset-0 bg-white/50 backdrop-blur-sm ${isOpen ? 'animate-backdropIn' : 'animate-backdropOut'}`} ref={refBackdrop}></div>
            <div className={`relative z-10 w-full max-w-2xl rounded-4xl border border-white/60 bg-green-50 p-6 glass-card shadow-soft sm:p-8 ${isOpen ? "animate-modalIn" : "animate-modalOut"}`} onAnimationEnd={handleAnimationEnd}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-green-600">{description}</p>
                        <h3 className="mt-1 text-2xl font-semibold text-green-900">
                            {title}
                        </h3>
                    </div>
                    <button type="button" onClick={closeModal}
                        className="rounded-full bg-white p-2 text-green-600 transition hover:bg-green-100 hover:text-green-900 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>

                {children}

            </div>
        </div>
    );
}


Modal.Footer = ({ children }: { children: ReactNode }) => {
    return <div className="mt-8 flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
        {children}
    </div>;
};
