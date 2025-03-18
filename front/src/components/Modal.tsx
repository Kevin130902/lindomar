import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext<{ isOpen: boolean; toggle: (v?: boolean) => void }>(undefined!);

export function useModal() {
    return useContext(ModalContext).toggle;
}

function ModalInner() {
    const { toggle } = useContext(ModalContext);

    return (
        <div style={{ padding: "4em 1em" }} className="bg-black/50 w-[100%] h-[100%]">
            <div className="max-w-[800px] h-[100%] bg-white rounded-md" style={{ padding: "2em", margin: "0 auto" }}>
                <button style={{ marginBottom: "1em" }} className="cursor-pointer text-end" onClick={() => toggle(false)}>Fechar</button>
                <div id="modal-children"></div>
            </div>
        </div>
    );
}

export function Modal({ children }: React.PropsWithChildren) {
    const childrenContainer = document.getElementById("modal-children");

    return <>{childrenContainer && createPortal(children, childrenContainer)}</>;
}

export function ModalRenderer() {
    const { isOpen } = useContext(ModalContext);
    const className = "absolute w-screen " + (isOpen ? "h-screen" : "");

    return <div id="modal-renderer" className={className}>{isOpen && <ModalInner />}</div>;
}

export function ModalProvider({ children }: React.PropsWithChildren) {
    const [isOpen, setOpen] = useState(false);

    const toggleFn = (current?: boolean) => !current;

    return <ModalContext.Provider value={{ isOpen, toggle: (v) => setOpen(v !== undefined ? v : toggleFn) }}>
        {children}
    </ModalContext.Provider>;
}