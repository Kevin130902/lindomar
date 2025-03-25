/// <reference types="vite/client" />

interface LoginResponse {
    refresh: string;
    access: string;
}

interface Professor {
    id: number;
    ni: string;
    nome: string;
    email: string;
    cel: string;
    ocup: number;
}

type ProfessoresResponse = Professor[];

interface Disciplina {
    id: number;
    sigla: string;
    curso: string;
    semestre: number;
    carga_horaria: number;
}

type DisciplinasResponse = Disciplina[];

interface Turma {
    id: number;
    nome: string;
}

type TurmaResponse = Turma[];

interface Curso {
    id: number;
    curso: string;
    tipo: "CAI" | "CT" | "CS" | "FIC";
    hora_aula: number;
    sigla: string;
}

type CursoResponse = Curso[];

interface Ambiente {
    id: number;
    sala: string;
    capacidade: number;
    responsavel: string;
    periodo: string;
}

type AmbienteResponse = Ambiente[];