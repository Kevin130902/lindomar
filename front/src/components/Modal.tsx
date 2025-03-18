import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext<{ isOpen: boolean; toggle: (v?: boolean) => void }>(undefined!);

export function useModal() {
    return useContext(ModalContext);
}

export function Modal({ children }: React.PropsWithChildren) {
    const { isOpen, toggle } = useContext(ModalContext);

    const el = (
        <div className="absolute w-screen h-screen">
            <div style={{ padding: "4em 1em" }} className="bg-black/50 w-[100%] h-[100%]">
                <div className="max-w-[800px] bg-white rounded-md" style={{ padding: "2em", margin: "0 auto" }}>
                    <button style={{ marginBottom: "1em" }} className="cursor-pointer text-end" onClick={() => toggle(false)}>Fechar</button>
                    <div style={{ margin: "0 auto" }}>{children}</div>
                </div>
            </div>
        </div>
    );

    const container = document.getElementById("modal-container");

    return <>{container && isOpen && createPortal(el, container)}</>;
}

export function ModalRenderer() {
    return <div id="modal-container"></div>;
}

export function ModalProvider({ children }: React.PropsWithChildren) {
    const [isOpen, setOpen] = useState(false);

    const toggleFn = (current?: boolean) => !current;

    return <ModalContext.Provider value={{ isOpen, toggle: (v) => setOpen(v !== undefined ? v : toggleFn) }}>
        {children}
    </ModalContext.Provider>;
}