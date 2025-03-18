import { ModalProvider, ModalRenderer } from "./components/Modal";

function Header() {
    return (
        <header className="w-full h-[90px] bg-blue-950">
            {/* TODO */}
        </header>
    );
}

function Footer() {
    return <footer>{/* TODO */}</footer>;
}

export function Layout({ children }: React.PropsWithChildren) {
    return (
        <ModalProvider>
            <ModalRenderer />
            <Header />
            <main style={{ margin: "0 auto" }} className="max-w-[1200px]">
                <div style={{ margin: "1em 2em" }}></div>{children}
            </main>
            <Footer />
        </ModalProvider>
    );
}