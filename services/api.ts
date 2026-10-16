import { LoginResponse, UsuarioLogado } from '../models/Autenticacao';
import { Cliente } from '../models/Cliente';
import { Funcionario } from '../models/Funcionario';
import { Produto } from '../models/Produto';
import { Venda, VendaRelacionada, VendaRequest } from '../models/Venda';

const enderecoConfigurado = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
const API_URL = enderecoConfigurado.replace(/\/$/, '');
let tokenAtual: string | null = null;

export class ErroApi extends Error {
    status: number;

    constructor(status: number, mensagem: string) {
        super(mensagem);
        this.status = status;
    }
}

export function definirToken(token: string | null) {
    tokenAtual = token;
}

async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
    const resposta = await fetch(`${API_URL}${caminho}`, {
        ...opcoes,
        headers: {
            'Content-Type': 'application/json',
            ...(tokenAtual ? { Authorization: `Bearer ${tokenAtual}` } : {}),
        },
    });

    if (!resposta.ok) {
        let mensagem = `A API respondeu com o status ${resposta.status}.`;

        try {
            const erro = await resposta.json() as { mensagem?: string };
            mensagem = erro.mensagem ?? mensagem;
        } catch {
            // A mensagem padrão continua quando a API não devolve JSON.
        }

        throw new ErroApi(resposta.status, mensagem);
    }

    if (resposta.status === 204) {
        return undefined as T;
    }

    return resposta.json() as Promise<T>;
}

// O token fica aqui para todas as telas usarem a mesma autenticação.
export function entrar(cpf: string, senha: string) {
    return requisicao<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ cpf, senha }),
    });
}

export function buscarUsuarioLogado() {
    return requisicao<UsuarioLogado>('/auth/me');
}

export function buscarClientes() {
    return requisicao<Cliente[]>('/cliente');
}

export function buscarClientePorId(id: number) {
    return requisicao<Cliente>(`/cliente/${id}`);
}

export function cadastrarCliente(cliente: Omit<Cliente, 'id'>) {
    return requisicao<Cliente>('/cliente', {
        method: 'POST',
        body: JSON.stringify(cliente),
    });
}

export function atualizarCliente(id: number, cliente: Omit<Cliente, 'id'>) {
    return requisicao<Cliente>(`/cliente/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente),
    });
}

export function excluirCliente(id: number) {
    return requisicao<void>(`/cliente/${id}`, { method: 'DELETE' });
}

export function buscarVendasDoCliente(id: number) {
    return requisicao<VendaRelacionada[]>(`/cliente/${id}/vendas`);
}

export function buscarFuncionarios() {
    return requisicao<Funcionario[]>('/funcionario');
}

export function buscarFuncionarioPorId(id: number) {
    return requisicao<Funcionario>(`/funcionario/${id}`);
}

export type DadosFuncionario = Omit<Funcionario, 'id' | 'salario'> & {
    senha: string,
    salario: number
};

export function cadastrarFuncionario(funcionario: DadosFuncionario) {
    return requisicao<Funcionario>('/funcionario', {
        method: 'POST',
        body: JSON.stringify(funcionario),
    });
}

export function atualizarFuncionario(id: number, funcionario: DadosFuncionario) {
    return requisicao<Funcionario>(`/funcionario/${id}`, {
        method: 'PUT',
        body: JSON.stringify(funcionario),
    });
}

export function excluirFuncionario(id: number) {
    return requisicao<void>(`/funcionario/${id}`, { method: 'DELETE' });
}

export function buscarVendasDoFuncionario(id: number) {
    return requisicao<VendaRelacionada[]>(`/funcionario/${id}/vendas`);
}

export function buscarProdutos() {
    return requisicao<Produto[]>('/produto');
}

export function buscarProdutoPorId(id: number) {
    return requisicao<Omit<Produto, 'descricao'>>(`/produto/${id}`);
}

export function cadastrarProduto(produto: Omit<Produto, 'id'>) {
    return requisicao<Produto>('/produto', {
        method: 'POST',
        body: JSON.stringify(produto),
    });
}

export function atualizarProduto(id: number, produto: Omit<Produto, 'id'>) {
    return requisicao<Produto>(`/produto/${id}`, {
        method: 'PUT',
        body: JSON.stringify(produto),
    });
}

export function excluirProduto(id: number) {
    return requisicao<void>(`/produto/${id}`, { method: 'DELETE' });
}

export function buscarVendas() {
    return requisicao<Venda[]>('/venda');
}

export function buscarVendaPorId(id: number) {
    return requisicao<Venda>(`/venda/${id}`);
}

export function registrarVenda(venda: VendaRequest) {
    return requisicao<Venda>('/venda', {
        method: 'POST',
        body: JSON.stringify(venda),
    });
}

export function atualizarVenda(id: number, venda: VendaRequest) {
    return requisicao<Venda>(`/venda/${id}`, {
        method: 'PUT',
        body: JSON.stringify(venda),
    });
}

export function excluirVenda(id: number) {
    return requisicao<void>(`/venda/${id}`, { method: 'DELETE' });
}

export async function perguntarAoAssistente(pergunta: string) {
    const resposta = await requisicao<{ resposta: string }>('/assistente/pergunta', {
        method: 'POST',
        body: JSON.stringify({ pergunta }),
    });

    return resposta.resposta;
}
