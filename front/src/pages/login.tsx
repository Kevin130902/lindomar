import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router";

import { API_URL } from "../constants";

import { Button } from "../components/Button";
import { TextBox } from "../components/TextBox";

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

                    <Button text="Entrar" />
                </form>
            </div>
        </div>
    );
}