import { Cliente } from './Cliente';
import { Funcionario } from './Funcionario';
import { Produto } from './Produto';

export type ItemVenda = {
    produtoId: number,
    produto: string,
    quantidade: number,
    subtotal: number
}

export type ItemVendaRequest = {
    produtoId: number,
    quantidade: number
}

export type VendaRequest = {
    dataVenda: string,
    clienteId: number,
    funcionarioId: number,
    itens: ItemVendaRequest[]
}

export type Venda = {
    id: number,
    dataVenda: string,
    valorTotal: number,
    cliente: Cliente,
    funcionario: Funcionario,
    itens: ItemVenda[]
}

export type VendaRelacionada = {
    id: number,
    dataVenda: string,
    valorTotal: number,
    cliente: Cliente,
    funcionario: Funcionario,
    itens: {
        id: number,
        quantidade: number,
        subtotal: number,
        produto: Produto
    }[]
}
