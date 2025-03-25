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
    turma: ["Nome"],
    curso: ["Curso", "Tipo", "Hora de Aula", "Sigla"],
    ambiente: ["Sala", "Capacidade", "Responsável", "Período"],
} satisfies { [key: string]: string[] }

type EditableCategory = keyof typeof EDITABLE_MAP;

interface TableEntry {
    id: number; // id na tabela
    values: string[];
}

function bearer(token: string) {
    return "Bearer " + token;
}

function ArrowButton({ right = false as never, onClick }: { right?: true, onClick: () => void }) {
    return <button className="cursor-pointer w-[30px]" onClick={onClick} style={{ margin: "0 0.5em" }}>{right ? ">" : "<"}</button>;
}

function TableView(
    { titles, content, onEdit, onDelete }: { titles: string[], content: TableEntry[]; onEdit: (entry: TableEntry) => void; onDelete: (entry: TableEntry) => void; }
) {
    // const token = useToken();
    const { toggle: toggleModal } = useModal();

    return (
        <table className="table-auto w-full border-[1px]">
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
                                            onEdit(entry);
                                            toggleModal(false);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="cursor-pointer text-red-800"
                                        onClick={() => onDelete(entry)}
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

    const token = useToken();
    const selectedSection = sections[cursor];
    const baseUrl = `${API_URL}${selectedSection}`;

    useEffect(() => {
        if (selectedSection === "professores") {
            setModalFields(["nome", "email", "cel", "ni", "ocup"]);
        } else if (selectedSection === "disciplinas") {
            setModalFields(["sigla", "curso", "semestre", "carga_horaria"]);
        } else if (selectedSection === "turma") {
            setModalFields(["nome"]);
        } else if (selectedSection === "curso") {
            setModalFields(["curso", "tipo", "hora_aula", "sigla"]);
        } else if (selectedSection === "ambiente") {
            setModalFields(["sala", "capacidade", "responsavel", "periodo"]);
        }

        if (!token) return;

        axios.get(API_URL + selectedSection, { headers: { Authorization: bearer(token) } })
            .then((res) => {
                if (selectedSection === "professores") {
                    return (res as AxiosResponse<ProfessoresResponse>).data.map(
                        (x) => ({ id: x.id, values: [x.nome, x.email, x.cel, x.ni, String(x.ocup)] }),
                    );
                } else if (selectedSection === "disciplinas") {
                    return (res as AxiosResponse<DisciplinasResponse>).data.map(
                        (x) => ({ id: x.id, values: [x.sigla, x.curso, String(x.semestre), String(x.carga_horaria)] }),
                    );
                } else if (selectedSection === "turma") {
                    return (res as AxiosResponse<TurmaResponse>).data.map(
                        (x) => ({ id: x.id, values: [x.nome] }),
                    );
                } else if (selectedSection === "curso") {
                    return (res as AxiosResponse<CursoResponse>).data.map(
                        (x) => ({ id: x.id, values: [x.curso, x.tipo, String(x.hora_aula), x.sigla] }),
                    );
                } else if (selectedSection === "ambiente") {
                    return (res as AxiosResponse<AmbienteResponse>).data.map(
                        (x) => ({ id: x.id, values: [x.sala, String(x.capacidade), x.responsavel, x.periodo] }),
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
        if (!token) return;

        const id = selectedEntry?.id;
        const newData = Object.fromEntries(formData.entries());

        if (id) {
            await axios.put(baseUrl + "/id/" + id, newData, { headers: { Authorization: bearer(token) } });
        } else {
            await axios.post(baseUrl, newData, { headers: { Authorization: bearer(token) } });
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
                    <Button text="Criar" onClick={() => toggleModal(true)} />
                </div>
            </div>
            <TableView
                titles={EDITABLE_MAP[selectedSection]}
                content={table}
                onEdit={setSelectedEntry}
                onDelete={({ id }) => {
                    if (window.confirm("Tem certeza?")) {
                        axios.delete(baseUrl + "/id/" + id, { headers: { Authorization: bearer(token!) } }).finally(() => window.location.reload());
                    }
                }}
            />
        </>
    );
}