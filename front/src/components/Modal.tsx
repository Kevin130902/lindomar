import { createContext, useState } from "react";

const ModalContext = createContext<{ isOpen: boolean }>(undefined!);

export function Modal() {
    return (
        <div>
            {/* TODO */}
        </div>
    );
}

export function ModalProvider() {
    const [isOpen, setOpen] = useState(false);

    return <ModalContext.Provider value={{ isOpen }}></ModalContext.Provider>;
}