import { faBell, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, type Dispatch, type SetStateAction, useEffect } from "react";


interface Props {
    title: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
}

export default function OffCanva({ title, isOpen, children, setIsOpen }: Props) {

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                />
            )}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 right-4 z-50 md:hidden bg-green-800 cursor-pointer text-white p-3 rounded-xl shadow-soft"
                >
                    <FontAwesomeIcon icon={faBell} />
                </button>
            )}

            <aside id="sidebar"
                className={`fixed top-0 right-0 h-full w-full  p-4 z-51  transform ${isOpen ? "translate-x-0" : "translate-x-full"}  md:translate-x transition-transform duration-300`}>

                <div className="glass-card  h-full rounded-4xl border border-white/60 shadow-soft p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-green-900">{title}</h2>

                            <button onClick={() => setIsOpen(false)} className="md:hidden text-green-800 cursor-pointer">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto pe-3">
                        {children}
                    </div>
                </div>
            </aside>
        </>
    );
}