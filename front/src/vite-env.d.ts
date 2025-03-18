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

interface LoginResponse {
    refresh: string;
    access: string;
}