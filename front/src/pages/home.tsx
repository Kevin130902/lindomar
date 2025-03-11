import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8000/api/";

const EDITABLE_MAP = {
    professores: ["Nome", "E-mail", "Cel", "NI", "Ocupação"],
    disciplinas: ["Sigla", "Curso", "Semestre", "Carga Horária"],
} satisfies { [key: string]: string[] }

type EditableCategory = keyof typeof EDITABLE_MAP;

interface EditEntry {
    id: number; // id na tabela
    values: string[];
}

function ArrowButton({ right = false as never, onClick }: { right?: true, onClick: () => void }) {
    return <button className="cursor-pointer w-[30px]" onClick={onClick} style={{ margin: "0 0.5em" }}>{right ? ">" : "<"}</button>;
}

function EditList({ titles, content }: { titles: string[], content: EditEntry[] }) {
    return (
        <table className="table-fixed w-full border-[1px]">
            <thead>
                <tr className="bg-zinc-600">
                    {...titles.map((title) => <th className="text-white">{title}</th>)}
                    <th className="text-white">-</th>
                </tr>
            </thead>
            <tbody>
                {
                    ...content.map(({ values }, n) =>
                        <tr className={n % 2 == 0 ? "bg-zinc-300" : "bg-zinc-400"}>
                            {[
                                ...values.map((v, i) => <td key={`child_${i}`} className="text-center">{v}</td>),
                                <td key="edit" className="flex gap-[14px] justify-center">
                                    <button className="cursor-pointer text-blue-800">Editar</button>
                                    <button className="cursor-pointer text-red-800">Deletar</button>
                                </td>
                            ]}
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}

export function HomePage() {
    const urlSection = useSearchParams()[0].get("list") as EditableCategory | null;
    const sections = useMemo(() => Object.keys(EDITABLE_MAP), []) as EditableCategory[];
    const [cursor, setCursor] = useState<number>(() => urlSection !== null ? sections.findIndex((v) => v === urlSection) : 0);
    const [table, setTable] = useState<EditEntry[]>([]);

    const selectedSection = sections[cursor];
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        axios.get(API_URL + selectedSection, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (selectedSection === "professores") {
                    const newTbl = (res as AxiosResponse<ProfessoresResponse>).data.map(
                        (prof) => ({ id: prof.id, values: [prof.nome, prof.email, prof.cel, prof.ni, String(prof.ocup)] }),
                    );

                    setTable(newTbl);
                } else if (selectedSection === "disciplinas") {
                    // TODO
                } else {
                    throw new Error("endpoint inválido");
                }

                console.log(res.data);
            })
            .catch(() => setTable([]));
    }, [selectedSection]);

    return (
        <>
            <div style={{ display: "flex", marginBottom: "2em" }}>
                <ArrowButton onClick={() => setCursor((n) => Math.max(n - 1, 0))} />
                <h1 className="text-center w-[160px]">{selectedSection}</h1>
                <ArrowButton right onClick={() => setCursor((n) => Math.min(n + 1, sections.length - 1))} />
            </div>
            <EditList titles={EDITABLE_MAP[selectedSection]} content={table} />
        </>
    );
}