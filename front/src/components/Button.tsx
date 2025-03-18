
interface ButtonProps {
    text?: string;
    onClick?: () => void;
}

export function Button({ text = "Button", onClick }: ButtonProps) {
    return <button style={{ padding: "2px 8px" }} className="cursor-pointer text-lg text-white bg-blue-950" type="submit" onClick={onClick}>{text}</button>;
}