
interface TextBoxProps {
    value?: React.InputHTMLAttributes<HTMLInputElement>["defaultValue"];
    name: string;
    hidden?: boolean;
}

export function TextBox({ name, value, hidden = false }: TextBoxProps) {
    return <div><input defaultValue={value} type={hidden ? "password" : "text"} className="bg-gray-200" style={{ padding: "6px", marginBottom: "1em" }} id={name} name={name} /></div>;
}