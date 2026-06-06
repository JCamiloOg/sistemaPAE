import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

export interface PopoverProps {
  // Propiedades del disparador usando Button
  triggerTitle?: string;
  triggerIcon?: IconDefinition;
  triggerColor?: "green" | "rose" | "gray" | "yellow" | "blue";
  triggerVariant?: "default" | "outline" | "semi";
  triggerSize?: "sm" | "md";
  triggerDisabled?: boolean;
  triggerClassName?: string;

  // Si se prefiere pasar un disparador completamente personalizado
  customTrigger?: ReactNode;

  // Contenido dentro del panel popover
  children: ReactNode;

  // Posicionamiento
  placement?:
  | "bottom-center"
  | "bottom-start"
  | "bottom-end"
  | "top-center"
  | "top-start"
  | "top-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

  // Título opcional en la cabecera del panel del popover
  title?: string;

  // Clases adicionales opcionales para el panel
  panelClassName?: string;
}

export default function Popover({
  triggerTitle = "",
  triggerIcon,
  triggerColor = "green",
  triggerVariant = "default",
  triggerSize = "md",
  triggerDisabled = false,
  triggerClassName = "",
  customTrigger,
  children,
  placement = "bottom-start",
  title,
  panelClassName = "",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => {
    if (!triggerDisabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const closePopover = () => setIsOpen(false);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  // Controlar el montaje/desmontaje con animaciones
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  // Sincronizar coordenadas en tiempo real al hacer scroll o resize
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  // Manejar click fuera del popover y tecla Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = containerRef.current && containerRef.current.contains(target);
      const clickedInsidePanel = panelRef.current && panelRef.current.contains(target);

      if (!clickedInsideTrigger && !clickedInsidePanel) {
        closePopover();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopover();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Clases CSS según la colocación (placement)
  const placementClasses = {
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-2 origin-top",
    "bottom-start": "top-full left-0 mt-2 origin-top-left",
    "bottom-end": "top-full right-0 mt-2 origin-top-right",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom",
    "top-start": "bottom-full left-0 mb-2 origin-bottom-left",
    "top-end": "bottom-full right-0 mb-2 origin-bottom-right",
    "left-start": "right-full top-0 mr-2 origin-top-right",
    "left-end": "right-full bottom-0 mr-2 origin-bottom-right",
    "right-start": "left-full top-0 ml-2 origin-top-left",
    "right-end": "left-full bottom-0 ml-2 origin-bottom-left",
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger */}
      <div onClick={togglePopover} className="cursor-pointer">
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            title={triggerTitle}
            icon={triggerIcon!}
            color={triggerColor}
            variant={triggerVariant}
            size={triggerSize}
            disabled={triggerDisabled}
            className={triggerClassName}
            type="button"
          />
        )}
      </div>

      {/* Renderizado mediante Portal en document.body */}
      {shouldRender &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              height: coords.height,
              pointerEvents: "none",
              zIndex: 100,
            }}
          >
            {/* Popover Panel con Micro-animación Glassmorphism */}
            <div
              ref={panelRef}
              onAnimationEnd={handleAnimationEnd}
              className={`absolute w-72 max-h-100 overflow-y-auto rounded-3xl border border-white/60 bg-green-50/90 glass-card shadow-soft p-4 pointer-events-auto
                ${placementClasses[placement]}
                ${isOpen ? "animate-modalIn" : "animate-modalOut"}
                ${panelClassName}
              `}
            >
              {/* Cabecera del popover si existe título */}
              {title && (
                <div className="border-b border-green-100/50 pb-2 mb-2">
                  <h4 className="text-sm font-semibold text-green-900 leading-tight">
                    {title}
                  </h4>
                </div>
              )}

              {/* Contenido del popover */}
              <div className="text-sm text-green-800 font-normal leading-relaxed">
                {children}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
