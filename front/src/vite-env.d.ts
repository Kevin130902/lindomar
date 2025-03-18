/// <reference types="vite/client" />

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

interface LoginResponse {
    refresh: string;
    access: string;
}