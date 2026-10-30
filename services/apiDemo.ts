import { LoginResponse, UsuarioLogado } from '../models/Autenticacao';
import { Cliente } from '../models/Cliente';
import { Funcionario } from '../models/Funcionario';
import { Produto } from '../models/Produto';
import { Venda, VendaRelacionada, VendaRequest } from '../models/Venda';

type DadosFuncionarioDemo = Omit<Funcionario, 'id' | 'salario'> & {
    senha: string,
    salario: number
}

const usuarioDemo: UsuarioLogado = {
    id: 1,
    nome: 'Luiz Almeida',
    cargo: 'Operador de caixa',
};

// Estes dados existem somente enquanto o aplicativo está aberto.
let clientes: Cliente[] = [
    {
        id: 1,
        nome: 'Maria Fernandes',
        cpf: '11122233344',
        email: 'maria@email.com',
        telefone: '18999991111',
    },
    {
        id: 2,
        nome: 'João Souza',
        cpf: '22233344455',
        email: 'joao@email.com',
        telefone: '18988882222',
    },
    {
        id: 3,
        nome: 'Ana Oliveira',
        cpf: '33344455566',
        email: 'ana@email.com',
        telefone: '18977773333',
    },
    {
        id: 4,
        nome: 'Carlos Pereira',
        cpf: '44455566677',
        email: 'carlos@email.com',
        telefone: '18966664444',
    },
];

let funcionarios: Funcionario[] = [
    {
        id: 1,
        nome: 'Luiz Almeida',
        cpf: '00000000000',
        cargo: 'Operador de caixa',
        salario: 2500,
    },
    {
        id: 2,
        nome: 'Melissa Santos',
        cpf: '12345678901',
        cargo: 'Gerente',
        salario: 4200,
    },
    {
        id: 3,
        nome: 'Rafael Lima',
        cpf: '98765432100',
        cargo: 'Estoquista',
        salario: 2800,
    },
];

let produtos: Produto[] = [
    { id: 1, nome: 'Coxinha de Frango', descricao: 'Salgado assado, unidade 90g', preco: 7.5, estoque: 42 },
    { id: 2, nome: 'Café Expresso', descricao: 'Dose única, copo 50ml', preco: 4, estoque: 30 },
    { id: 3, nome: 'Refrigerante Lata', descricao: 'Cola, lata 350ml', preco: 6, estoque: 87 },
    { id: 4, nome: 'Pão de Queijo', descricao: 'Pacote com 4 unidades', preco: 5.5, estoque: 30 },
    { id: 5, nome: 'Sorvete Picolé', descricao: 'Sabor morango, 60ml', preco: 8, estoque: 6 },
    { id: 6, nome: 'Chocolate Barra', descricao: 'Chocolate ao leite, 90g', preco: 6.5, estoque: 58 },
    { id: 7, nome: 'Esfirra de Carne', descricao: 'Salgado assado, unidade 100g', preco: 8.5, estoque: 4 },
    { id: 8, nome: 'Cappuccino', descricao: 'Copo 200ml, adoçado', preco: 6, estoque: 24 },
    { id: 9, nome: 'Água com Gás', descricao: 'Garrafa 500ml', preco: 4.5, estoque: 64 },
];

let vendas: Venda[] = [
    {
        id: 3,
        dataVenda: '2026-10-28',
        valorTotal: 19,
        cliente: copiar(clientes[0]),
        funcionario: copiar(funcionarios[0]),
        itens: [
            { produtoId: 1, produto: 'Coxinha de Frango', quantidade: 2, subtotal: 15 },
            { produtoId: 2, produto: 'Café Expresso', quantidade: 1, subtotal: 4 },
        ],
    },
    {
        id: 2,
        dataVenda: '2026-10-27',
        valorTotal: 17.5,
        cliente: copiar(clientes[2]),
        funcionario: copiar(funcionarios[0]),
        itens: [
            { produtoId: 4, produto: 'Pão de Queijo', quantidade: 2, subtotal: 11 },
            { produtoId: 6, produto: 'Chocolate Barra', quantidade: 1, subtotal: 6.5 },
        ],
    },
    {
        id: 1,
        dataVenda: '2026-10-26',
        valorTotal: 20,
        cliente: copiar(clientes[1]),
        funcionario: copiar(funcionarios[1]),
        itens: [
            { produtoId: 3, produto: 'Refrigerante Lata', quantidade: 2, subtotal: 12 },
            { produtoId: 5, produto: 'Sorvete Picolé', quantidade: 1, subtotal: 8 },
        ],
    },
];

const dadosIniciais = copiar({ clientes, funcionarios, produtos, vendas });

function copiar<T>(valor: T): T {
    return JSON.parse(JSON.stringify(valor)) as T;
}

function proximoId(itens: { id: number }[]) {
    return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

function encontrarCliente(id: number) {
    const cliente = clientes.find((item) => item.id === id);

    if (!cliente) {
        throw new Error('Cliente não encontrado.');
    }

    return cliente;
}

function encontrarFuncionario(id: number) {
    const funcionario = funcionarios.find((item) => item.id === id);

    if (!funcionario) {
        throw new Error('Funcionário não encontrado.');
    }

    return funcionario;
}

function encontrarProduto(id: number) {
    const produto = produtos.find((item) => item.id === id);

    if (!produto) {
        throw new Error('Produto não encontrado.');
    }

    return produto;
}

function montarVenda(id: number, dados: VendaRequest): Venda {
    const itens = dados.itens.map((item) => {
        const produto = encontrarProduto(item.produtoId);

        if (item.quantidade <= 0 || item.quantidade > produto.estoque) {
            throw new Error(`Estoque insuficiente para ${produto.nome}.`);
        }

        return {
            produtoId: produto.id,
            produto: produto.nome,
            quantidade: item.quantidade,
            subtotal: produto.preco * item.quantidade,
        };
    });

    return {
        id,
        dataVenda: dados.dataVenda,
        valorTotal: itens.reduce((total, item) => total + item.subtotal, 0),
        cliente: copiar(encontrarCliente(dados.clienteId)),
        funcionario: copiar(encontrarFuncionario(dados.funcionarioId)),
        itens,
    };
}

function transformarVenda(venda: Venda): VendaRelacionada {
    return {
        ...copiar(venda),
        itens: venda.itens.map((item, indice) => ({
            id: indice + 1,
            quantidade: item.quantidade,
            subtotal: item.subtotal,
            produto: copiar(encontrarProduto(item.produtoId)),
        })),
    };
}

export async function entrar(): Promise<LoginResponse> {
    return {
        token: 'token-demonstracao-local',
        tipo: 'Bearer',
        expiraEm: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        funcionario: copiar(usuarioDemo),
    };
}

export async function reiniciarDados() {
    clientes = copiar(dadosIniciais.clientes);
    funcionarios = copiar(dadosIniciais.funcionarios);
    produtos = copiar(dadosIniciais.produtos);
    vendas = copiar(dadosIniciais.vendas);
}

export async function buscarUsuarioLogado() {
    return copiar(usuarioDemo);
}

export async function buscarClientes() {
    return copiar(clientes);
}

export async function buscarClientePorId(id: number) {
    return copiar(encontrarCliente(id));
}

export async function cadastrarCliente(dados: Omit<Cliente, 'id'>) {
    const cliente = { ...dados, id: proximoId(clientes) };
    clientes = [...clientes, cliente];
    return copiar(cliente);
}

export async function atualizarCliente(id: number, dados: Omit<Cliente, 'id'>) {
    encontrarCliente(id);
    const cliente = { ...dados, id };
    clientes = clientes.map((item) => item.id === id ? cliente : item);
    vendas = vendas.map((venda) => venda.cliente.id === id
        ? { ...venda, cliente: copiar(cliente) }
        : venda
    );
    return copiar(cliente);
}

export async function excluirCliente(id: number) {
    encontrarCliente(id);
    clientes = clientes.filter((item) => item.id !== id);
}

export async function buscarVendasDoCliente(id: number) {
    encontrarCliente(id);
    return vendas
        .filter((venda) => venda.cliente.id === id)
        .map(transformarVenda);
}

export async function buscarFuncionarios() {
    return copiar(funcionarios);
}

export async function buscarFuncionarioPorId(id: number) {
    return copiar(encontrarFuncionario(id));
}

export async function cadastrarFuncionario(dados: DadosFuncionarioDemo) {
    const { senha: _senha, ...dadosSemSenha } = dados;
    const funcionario = { ...dadosSemSenha, id: proximoId(funcionarios) };
    funcionarios = [...funcionarios, funcionario];
    return copiar(funcionario);
}

export async function atualizarFuncionario(id: number, dados: DadosFuncionarioDemo) {
    encontrarFuncionario(id);
    const { senha: _senha, ...dadosSemSenha } = dados;
    const funcionario = { ...dadosSemSenha, id };
    funcionarios = funcionarios.map((item) => item.id === id ? funcionario : item);
    vendas = vendas.map((venda) => venda.funcionario.id === id
        ? { ...venda, funcionario: copiar(funcionario) }
        : venda
    );
    return copiar(funcionario);
}

export async function excluirFuncionario(id: number) {
    encontrarFuncionario(id);
    funcionarios = funcionarios.filter((item) => item.id !== id);
}

export async function buscarVendasDoFuncionario(id: number) {
    encontrarFuncionario(id);
    return vendas
        .filter((venda) => venda.funcionario.id === id)
        .map(transformarVenda);
}

export async function buscarProdutos() {
    return copiar(produtos);
}

export async function buscarProdutoPorId(id: number) {
    const { descricao: _descricao, ...produto } = encontrarProduto(id);
    return copiar(produto);
}

export async function cadastrarProduto(dados: Omit<Produto, 'id'>) {
    const produto = { ...dados, id: proximoId(produtos) };
    produtos = [...produtos, produto];
    return copiar(produto);
}

export async function atualizarProduto(id: number, dados: Omit<Produto, 'id'>) {
    encontrarProduto(id);
    const produto = { ...dados, id };
    produtos = produtos.map((item) => item.id === id ? produto : item);
    return copiar(produto);
}

export async function excluirProduto(id: number) {
    encontrarProduto(id);
    produtos = produtos.filter((item) => item.id !== id);
}

export async function buscarVendas() {
    return copiar(vendas);
}

export async function buscarVendaPorId(id: number) {
    const venda = vendas.find((item) => item.id === id);

    if (!venda) {
        throw new Error('Venda não encontrada.');
    }

    return copiar(venda);
}

export async function registrarVenda(dados: VendaRequest) {
    const venda = montarVenda(proximoId(vendas), dados);

    // Aqui o estoque local imita a baixa feita pela API real.
    produtos = produtos.map((produto) => {
        const item = venda.itens.find((atual) => atual.produtoId === produto.id);
        return item ? { ...produto, estoque: produto.estoque - item.quantidade } : produto;
    });
    vendas = [venda, ...vendas];
    return copiar(venda);
}

export async function atualizarVenda(id: number, dados: VendaRequest) {
    const vendaAnterior = await buscarVendaPorId(id);

    produtos = produtos.map((produto) => {
        const itemAnterior = vendaAnterior.itens.find(
            (item) => item.produtoId === produto.id
        );
        return itemAnterior
            ? { ...produto, estoque: produto.estoque + itemAnterior.quantidade }
            : produto;
    });

    try {
        const vendaAtualizada = montarVenda(id, dados);
        produtos = produtos.map((produto) => {
            const item = vendaAtualizada.itens.find(
                (atual) => atual.produtoId === produto.id
            );
            return item
                ? { ...produto, estoque: produto.estoque - item.quantidade }
                : produto;
        });
        vendas = vendas.map((venda) => venda.id === id ? vendaAtualizada : venda);
        return copiar(vendaAtualizada);
    } catch (erro) {
        produtos = produtos.map((produto) => {
            const itemAnterior = vendaAnterior.itens.find(
                (item) => item.produtoId === produto.id
            );
            return itemAnterior
                ? { ...produto, estoque: produto.estoque - itemAnterior.quantidade }
                : produto;
        });
        throw erro;
    }
}

export async function excluirVenda(id: number) {
    const venda = await buscarVendaPorId(id);
    produtos = produtos.map((produto) => {
        const item = venda.itens.find((atual) => atual.produtoId === produto.id);
        return item ? { ...produto, estoque: produto.estoque + item.quantidade } : produto;
    });
    vendas = vendas.filter((item) => item.id !== id);
}

export async function perguntarAoAssistente(pergunta: string) {
    const numeroInformado = pergunta.match(/(?:menos de|abaixo de)\s+(\d+)/i);
    const limite = numeroInformado ? Number(numeroInformado[1]) : 10;
    const estoqueBaixo = produtos.filter((produto) => produto.estoque < limite);

    if (estoqueBaixo.length === 0) {
        return `Nenhum produto está com menos de ${limite} unidades.`;
    }

    const lista = estoqueBaixo
        .map((produto) => `${produto.nome} (${produto.estoque} unidades)`)
        .join(', ');

    return `Produtos com menos de ${limite} unidades: ${lista}.`;
}
