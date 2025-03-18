import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router";

import { API_URL } from "../constants";

function TextBox({ name, hidden = false }: { name: string; hidden?: boolean }) {
    return <div><input type={hidden ? "password" : "text"} className="bg-gray-200" style={{ padding: "6px", marginBottom: "1em" }} id={name} name={name} /></div>;
}

export function LoginPage() {
    const navigate = useNavigate();

    async function loginAction(formData: FormData) {
        const username = formData.get("user");
        const password = formData.get("pass");

        if (!username || !password) return;

        const res: AxiosResponse<LoginResponse> = await axios.post(API_URL + "token/", {
            username,
            password,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { access } = res.data;

        localStorage.setItem("token", access);
        navigate("/home");
    }

    return (
        <div style={{ margin: "0 auto" }}>
            <div className="flex flex-col items-center">
                <h1 style={{ marginBottom: "1em" }} className="text-3xl">Login</h1>
                <form action={loginAction} id="login-form">
                    <TextBox name="user" />
                    <TextBox name="pass" hidden />

                    <button style={{ padding: "2px 8px" }} className="cursor-pointer text-lg text-white bg-blue-950" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}