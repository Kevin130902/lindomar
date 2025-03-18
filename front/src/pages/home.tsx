import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import axios, { AxiosResponse } from "axios";

import { Modal, useModal } from "../components/Modal";

import { useToken } from "../hooks/use-token";

import { API_URL } from "../constants";
import { Button } from "../components/Button";
import { TextBox } from "../components/TextBox";

const EDITABLE_MAP = {
    professores: ["Nome", "E-mail", "Cel", "NI", "Ocupação"],
    disciplinas: ["Sigla", "Curso", "Semestre", "Carga Horária"],
} satisfies { [key: string]: string[] }

type EditableCategory = keyof typeof EDITABLE_MAP;

interface TableEntry {
    id: number; // id na tabela
    values: string[];
}

function ArrowButton({ right = false as never, onClick }: { right?: true, onClick: () => void }) {
    return <button className="cursor-pointer w-[30px]" onClick={onClick} style={{ margin: "0 0.5em" }}>{right ? ">" : "<"}</button>;
}

function TableView({ titles, content, onEntryClick }: { titles: string[], content: TableEntry[]; onEntryClick: (entry: TableEntry) => void; }) {
    const token = useToken();
    const { toggle: toggleModal } = useModal();

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
                    ...content.map((entry, n) =>
                        <tr className={n % 2 == 0 ? "bg-zinc-300" : "bg-zinc-400"}>
                            {[
                                ...entry.values.map((v, i) => <td key={`child_${i}`} className="text-center">{v}</td>),
                                <td key="edit" className="flex gap-[14px] justify-center">
                                    <button
                                        className="cursor-pointer text-blue-800"
                                        onClick={() => {
                                            onEntryClick(entry);
                                            toggleModal();
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="cursor-pointer text-red-800"
                                        onClick={() => {
                                            if (window.confirm("Tem certeza?")) {
                                                axios.delete(API_URL + "id/" + entry.id, { headers: { Authorization: `Bearer ${token}` } });
                                            }
                                        }}
                                    >
                                        Deletar
                                    </button>
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
    const { isOpen, toggle: toggleModal } = useModal();
    const urlSection = useSearchParams()[0].get("list") as EditableCategory | null;
    const sections = useMemo(() => Object.keys(EDITABLE_MAP), []) as EditableCategory[];
    const [cursor, setCursor] = useState<number>(() => urlSection !== null ? sections.findIndex((v) => v === urlSection) : 0);
    const [table, setTable] = useState<TableEntry[]>([]);
    const [modalFields, setModalFields] = useState<string[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<TableEntry>();

    const selectedSection = sections[cursor];
    const token = useToken();

    useEffect(() => {
        if (selectedSection === "professores") {
            setModalFields(["nome", "email", "cel", "ni", "ocup"]);
        } else if (selectedSection === "disciplinas") {
            setModalFields(["sigla", "curso", "semestre", "carga_horaria"]);
        }

        if (!token) return;

        axios.get(API_URL + selectedSection, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (selectedSection === "professores") {
                    return (res as AxiosResponse<ProfessoresResponse>).data.map(
                        (prof) => ({ id: prof.id, values: [prof.nome, prof.email, prof.cel, prof.ni, String(prof.ocup)] }),
                    );
                } else if (selectedSection === "disciplinas") {
                    return (res as AxiosResponse<DisciplinasResponse>).data.map(
                        (disc) => ({ id: disc.id, values: [disc.sigla, disc.curso, String(disc.semestre), String(disc.carga_horaria)] }),
                    );
                } else {
                    throw new Error("endpoint inválido");
                }
            })
            .then((tbl) => setTable(tbl))
            .catch(() => {
                localStorage.removeItem("token");

                setTable([]);
            });
    }, [selectedSection, isOpen]);

    async function saveAction(formData: FormData) {
        const id = selectedEntry?.id;
        const newData = Object.fromEntries(formData.entries());

        if (id) {
            await axios.put(API_URL + "id/" + id, newData, { headers: { Authorization: `Bearer ${token}` } });
        } else {
            await axios.post(API_URL + selectedSection, newData, { headers: { Authorization: `Bearer ${token}` } });
        }

        toggleModal(false);
    }

    return (
        <>
            <Modal>
                <form action={saveAction}>
                    {modalFields.map((key, i) => {
                        return (
                            <>
                                <label className="text-lg" htmlFor={key}>{key}</label>
                                <TextBox key={`${key}_${i}`} name={key} value={selectedEntry?.values[i]} />
                            </>
                        );
                    })}

                    <Button text="Salvar" />
                </form>
            </Modal>

            <div className="flex justify-between">
                <div style={{ display: "flex", marginBottom: "2em" }}>
                    <ArrowButton onClick={() => setCursor((n) => Math.max(n - 1, 0))} />
                    <h1 className="text-center w-[160px]">{selectedSection}</h1>
                    <ArrowButton right onClick={() => setCursor((n) => Math.min(n + 1, sections.length - 1))} />
                </div>

                <div>
                    <Button text="Criar" onClick={() => {


                        toggleModal(true);
                    }} />
                </div>
            </div>
            <TableView titles={EDITABLE_MAP[selectedSection]} content={table} onEntryClick={setSelectedEntry} />
        </>
    );
}