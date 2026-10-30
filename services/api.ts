import { LoginResponse, UsuarioLogado } from '../models/Autenticacao';
import { Cliente } from '../models/Cliente';
import { Funcionario } from '../models/Funcionario';
import { Produto } from '../models/Produto';
import { Venda, VendaRelacionada, VendaRequest } from '../models/Venda';
import * as apiDemo from './apiDemo';

const API_PRODUCAO = 'https://api.20-151-6-104.sslip.io';
const enderecoConfigurado = process.env.EXPO_PUBLIC_API_URL?.trim();
const API_URL = (enderecoConfigurado || API_PRODUCAO).replace(/\/+$/, '');
export const MODO_DEMO = process.env.EXPO_PUBLIC_MODO_DEMO?.trim().toLowerCase() === 'true';
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

export function reiniciarDemonstracao() {
    if (MODO_DEMO) {
        return apiDemo.reiniciarDados();
    }

    return Promise.resolve();
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
    if (MODO_DEMO) {
        return apiDemo.entrar();
    }

    return requisicao<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ cpf, senha }),
    });
}

export function buscarUsuarioLogado() {
    if (MODO_DEMO) {
        return apiDemo.buscarUsuarioLogado();
    }

    return requisicao<UsuarioLogado>('/auth/me');
}

export function buscarClientes() {
    if (MODO_DEMO) {
        return apiDemo.buscarClientes();
    }

    return requisicao<Cliente[]>('/cliente');
}

export function buscarClientePorId(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarClientePorId(id);
    }

    return requisicao<Cliente>(`/cliente/${id}`);
}

export function cadastrarCliente(cliente: Omit<Cliente, 'id'>) {
    if (MODO_DEMO) {
        return apiDemo.cadastrarCliente(cliente);
    }

    return requisicao<Cliente>('/cliente', {
        method: 'POST',
        body: JSON.stringify(cliente),
    });
}

export function atualizarCliente(id: number, cliente: Omit<Cliente, 'id'>) {
    if (MODO_DEMO) {
        return apiDemo.atualizarCliente(id, cliente);
    }

    return requisicao<Cliente>(`/cliente/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente),
    });
}

export function excluirCliente(id: number) {
    if (MODO_DEMO) {
        return apiDemo.excluirCliente(id);
    }

    return requisicao<void>(`/cliente/${id}`, { method: 'DELETE' });
}

export function buscarVendasDoCliente(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarVendasDoCliente(id);
    }

    return requisicao<VendaRelacionada[]>(`/cliente/${id}/vendas`);
}

export function buscarFuncionarios() {
    if (MODO_DEMO) {
        return apiDemo.buscarFuncionarios();
    }

    return requisicao<Funcionario[]>('/funcionario');
}

export function buscarFuncionarioPorId(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarFuncionarioPorId(id);
    }

    return requisicao<Funcionario>(`/funcionario/${id}`);
}

export type DadosFuncionario = Omit<Funcionario, 'id' | 'salario'> & {
    senha: string,
    salario: number
};

export function cadastrarFuncionario(funcionario: DadosFuncionario) {
    if (MODO_DEMO) {
        return apiDemo.cadastrarFuncionario(funcionario);
    }

    return requisicao<Funcionario>('/funcionario', {
        method: 'POST',
        body: JSON.stringify(funcionario),
    });
}

export function atualizarFuncionario(id: number, funcionario: DadosFuncionario) {
    if (MODO_DEMO) {
        return apiDemo.atualizarFuncionario(id, funcionario);
    }

    return requisicao<Funcionario>(`/funcionario/${id}`, {
        method: 'PUT',
        body: JSON.stringify(funcionario),
    });
}

export function excluirFuncionario(id: number) {
    if (MODO_DEMO) {
        return apiDemo.excluirFuncionario(id);
    }

    return requisicao<void>(`/funcionario/${id}`, { method: 'DELETE' });
}

export function buscarVendasDoFuncionario(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarVendasDoFuncionario(id);
    }

    return requisicao<VendaRelacionada[]>(`/funcionario/${id}/vendas`);
}

export function buscarProdutos() {
    if (MODO_DEMO) {
        return apiDemo.buscarProdutos();
    }

    return requisicao<Produto[]>('/produto');
}

export function buscarProdutoPorId(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarProdutoPorId(id);
    }

    return requisicao<Omit<Produto, 'descricao'>>(`/produto/${id}`);
}

export function cadastrarProduto(produto: Omit<Produto, 'id'>) {
    if (MODO_DEMO) {
        return apiDemo.cadastrarProduto(produto);
    }

    return requisicao<Produto>('/produto', {
        method: 'POST',
        body: JSON.stringify(produto),
    });
}

export function atualizarProduto(id: number, produto: Omit<Produto, 'id'>) {
    if (MODO_DEMO) {
        return apiDemo.atualizarProduto(id, produto);
    }

    return requisicao<Produto>(`/produto/${id}`, {
        method: 'PUT',
        body: JSON.stringify(produto),
    });
}

export function excluirProduto(id: number) {
    if (MODO_DEMO) {
        return apiDemo.excluirProduto(id);
    }

    return requisicao<void>(`/produto/${id}`, { method: 'DELETE' });
}

export function buscarVendas() {
    if (MODO_DEMO) {
        return apiDemo.buscarVendas();
    }

    return requisicao<Venda[]>('/venda');
}

export function buscarVendaPorId(id: number) {
    if (MODO_DEMO) {
        return apiDemo.buscarVendaPorId(id);
    }

    return requisicao<Venda>(`/venda/${id}`);
}

export function registrarVenda(venda: VendaRequest) {
    if (MODO_DEMO) {
        return apiDemo.registrarVenda(venda);
    }

    return requisicao<Venda>('/venda', {
        method: 'POST',
        body: JSON.stringify(venda),
    });
}

export function atualizarVenda(id: number, venda: VendaRequest) {
    if (MODO_DEMO) {
        return apiDemo.atualizarVenda(id, venda);
    }

    return requisicao<Venda>(`/venda/${id}`, {
        method: 'PUT',
        body: JSON.stringify(venda),
    });
}

export function excluirVenda(id: number) {
    if (MODO_DEMO) {
        return apiDemo.excluirVenda(id);
    }

    return requisicao<void>(`/venda/${id}`, { method: 'DELETE' });
}

export async function perguntarAoAssistente(pergunta: string) {
    if (MODO_DEMO) {
        return apiDemo.perguntarAoAssistente(pergunta);
    }

    const resposta = await requisicao<{ resposta: string }>('/assistente/pergunta', {
        method: 'POST',
        body: JSON.stringify({ pergunta }),
    });

    return resposta.resposta;
}
