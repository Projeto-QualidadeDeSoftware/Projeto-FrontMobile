import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Menu, { Tela } from './components/Menu';
import { UsuarioLogado } from './models/Autenticacao';
import { Cliente } from './models/Cliente';
import { Funcionario } from './models/Funcionario';
import { Produto } from './models/Produto';
import { ItemVendaRequest, Venda } from './models/Venda';
import Inicio from './screens/Inicio';
import Login from './screens/Login';
import Mais from './screens/Mais';
import Clientes from './screens/Clientes';
import Funcionarios from './screens/Funcionarios';
import Produtos from './screens/Produtos';
import Vendas from './screens/Vendas';
import Configuracoes from './screens/Configuracoes';
import Privacidade from './screens/Privacidade';
import {
    ErroApi,
    DadosFuncionario,
    atualizarCliente as atualizarClienteApi,
    atualizarFuncionario as atualizarFuncionarioApi,
    atualizarProduto as atualizarProdutoApi,
    buscarClientes,
    buscarFuncionarios,
    buscarProdutos,
    buscarVendas,
    cadastrarCliente as cadastrarClienteApi,
    cadastrarFuncionario as cadastrarFuncionarioApi,
    cadastrarProduto as cadastrarProdutoApi,
    definirToken,
    entrar as entrarApi,
    excluirCliente as excluirClienteApi,
    excluirFuncionario as excluirFuncionarioApi,
    excluirProduto as excluirProdutoApi,
    MODO_DEMO,
    perguntarAoAssistente,
    reiniciarDemonstracao,
    registrarVenda,
} from './services/api';
import { cores } from './theme/tema';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

export default function App() {
    return (
        <SafeAreaProvider>
            <Aplicativo />
        </SafeAreaProvider>
    );
}

function Aplicativo() {
    // Os dados ficam aqui porque são usados por mais de uma tela.
    const[telaAtual, setTelaAtual] = useState<Tela>('inicio');
    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[clientes, setClientes] = useState<Cliente[]>([]);
    const[funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const[vendas, setVendas] = useState<Venda[]>([]);
    const[quantidades, setQuantidades] = useState<Record<number, number>>({});
    const[clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
    const[funcionarioSelecionado, setFuncionarioSelecionado] = useState<number | null>(null);
    const[usuario, setUsuario] = useState<UsuarioLogado | null>(null);

    async function carregarDados(funcionarioLogadoId: number) {
        const[
            produtosRecebidos,
            clientesRecebidos,
            funcionariosRecebidos,
            vendasRecebidas,
        ] = await Promise.all([
            buscarProdutos(),
            buscarClientes(),
            buscarFuncionarios(),
            buscarVendas(),
        ]);

        setProdutos(produtosRecebidos);
        setClientes(clientesRecebidos);
        setFuncionarios(funcionariosRecebidos);
        setVendas(vendasRecebidas);
        setClienteSelecionado(null);
        setFuncionarioSelecionado(
            funcionariosRecebidos.some((item) => item.id === funcionarioLogadoId)
                ? funcionarioLogadoId
                : funcionariosRecebidos[0]?.id ?? null
        );
    }

    async function entrar(cpf: string, senha: string): Promise<ResultadoOperacao> {
        try {
            const login = await entrarApi(cpf, senha);
            definirToken(login.token);
            await carregarDados(login.funcionario.id);
            setUsuario(login.funcionario);

            return { sucesso: true, mensagem: 'Login realizado.' };
        } catch (erro) {
            definirToken(null);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível entrar.'),
            };
        }
    }

    function sair() {
        definirToken(null);
        setUsuario(null);
        setProdutos([]);
        setClientes([]);
        setFuncionarios([]);
        setVendas([]);
        setClienteSelecionado(null);
        setFuncionarioSelecionado(null);
        setTelaAtual('inicio');
        setQuantidades({});
    }

    async function atualizarDados(): Promise<ResultadoOperacao> {
        if (!usuario) {
            return { sucesso: false, mensagem: 'A sessão não está disponível.' };
        }

        try {
            await carregarDados(usuario.id);
            setQuantidades({});
            return { sucesso: true, mensagem: 'Os dados foram atualizados.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível atualizar os dados.'),
            };
        }
    }

    async function reiniciarDadosDemo(): Promise<ResultadoOperacao> {
        if (!MODO_DEMO || !usuario) {
            return { sucesso: false, mensagem: 'A demonstração não está ativa.' };
        }

        try {
            await reiniciarDemonstracao();
            await carregarDados(usuario.id);
            setQuantidades({});
            return { sucesso: true, mensagem: 'A demonstração voltou ao estado inicial.' };
        } catch (erro) {
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível reiniciar a demonstração.'),
            };
        }
    }

    function alterarQuantidade(id: number, novaQuantidade: number) {
        const produto = produtos.find((item) => item.id === id);

        if (!produto) {
            return;
        }

        const quantidadeValida = Math.max(0, Math.min(novaQuantidade, produto.estoque));

        setQuantidades((atuais) => {
            const proximas = { ...atuais };

            if (quantidadeValida === 0) {
                delete proximas[id];
            } else {
                proximas[id] = quantidadeValida;
            }

            return proximas;
        });
    }

    async function finalizarVenda(): Promise<ResultadoOperacao> {
        const itens: ItemVendaRequest[] = Object.entries(quantidades)
            .map(([produtoId, quantidade]) => ({
                produtoId: Number(produtoId),
                quantidade,
            }))
            .filter((item) => item.quantidade > 0);

        if (itens.length === 0) {
            return { sucesso: false, mensagem: 'Selecione pelo menos um produto.' };
        }

        if (clienteSelecionado === null || funcionarioSelecionado === null) {
            return { sucesso: false, mensagem: 'Selecione o cliente e o vendedor.' };
        }

        const cliente = clientes.find((item) => item.id === clienteSelecionado);
        const funcionario = funcionarios.find((item) => item.id === funcionarioSelecionado);

        if (!cliente || !funcionario) {
            return { sucesso: false, mensagem: 'Cliente ou funcionário não encontrado.' };
        }

        try {
            const novaVenda: Venda = await registrarVenda({
                dataVenda: new Date().toISOString().slice(0, 10),
                clienteId: clienteSelecionado,
                funcionarioId: funcionarioSelecionado,
                itens,
            });

            // A API já baixou o estoque; aqui a tela só acompanha o novo valor.
            setProdutos((atuais) => atuais.map((produto) => {
                const itemVendido = novaVenda.itens.find(
                    (item) => item.produtoId === produto.id
                );

                return itemVendido
                    ? { ...produto, estoque: produto.estoque - itemVendido.quantidade }
                    : produto;
            }));
            setVendas((atuais) => [novaVenda, ...atuais]);
            setQuantidades({});

            return {
                sucesso: true,
                mensagem: 'A venda foi salva e o estoque foi atualizado.',
            };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível registrar a venda.'),
            };
        }
    }

    async function cadastrarProduto(
        dados: Omit<Produto, 'id'>
    ): Promise<ResultadoOperacao> {
        try {
            const novoProduto = await cadastrarProdutoApi(dados);

            setProdutos((atuais) => [...atuais, novoProduto]);
            return { sucesso: true, mensagem: 'Produto cadastrado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível cadastrar o produto.'),
            };
        }
    }

    async function atualizarProduto(
        id: number,
        dados: Omit<Produto, 'id'>
    ): Promise<ResultadoOperacao> {
        try {
            const produtoAtualizado = await atualizarProdutoApi(id, dados);

            setProdutos((atuais) => atuais.map((produto) =>
                produto.id === id ? produtoAtualizado : produto
            ));
            return { sucesso: true, mensagem: 'Produto atualizado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível atualizar o produto.'),
            };
        }
    }

    async function excluirProduto(id: number): Promise<ResultadoOperacao> {
        try {
            await excluirProdutoApi(id);

            setProdutos((atuais) => atuais.filter((produto) => produto.id !== id));
            setQuantidades((atuais) => {
                const proximas = { ...atuais };
                delete proximas[id];
                return proximas;
            });

            return { sucesso: true, mensagem: 'Produto excluído.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível excluir o produto.'),
            };
        }
    }

    async function cadastrarCliente(
        dados: Omit<Cliente, 'id'>
    ): Promise<ResultadoOperacao> {
        try {
            const novoCliente = await cadastrarClienteApi(dados);

            setClientes((atuais) => [...atuais, novoCliente]);
            setClienteSelecionado((atual) => atual ?? novoCliente.id);
            return { sucesso: true, mensagem: 'Cliente cadastrado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível cadastrar o cliente.'),
            };
        }
    }

    async function atualizarCliente(
        id: number,
        dados: Omit<Cliente, 'id'>
    ): Promise<ResultadoOperacao> {
        try {
            const clienteAtualizado = await atualizarClienteApi(id, dados);

            setClientes((atuais) => atuais.map((cliente) =>
                cliente.id === id ? clienteAtualizado : cliente
            ));
            setVendas((atuais) => atuais.map((venda) =>
                venda.cliente.id === id
                    ? { ...venda, cliente: clienteAtualizado }
                    : venda
            ));
            return { sucesso: true, mensagem: 'Cliente atualizado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível atualizar o cliente.'),
            };
        }
    }

    async function excluirCliente(id: number): Promise<ResultadoOperacao> {
        try {
            await excluirClienteApi(id);

            const clientesRestantes = clientes.filter((cliente) => cliente.id !== id);
            setClientes(clientesRestantes);

            if (clienteSelecionado === id) {
                setClienteSelecionado(clientesRestantes[0]?.id ?? null);
            }

            return { sucesso: true, mensagem: 'Cliente excluído.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível excluir o cliente.'),
            };
        }
    }

    async function cadastrarFuncionario(
        dados: DadosFuncionario
    ): Promise<ResultadoOperacao> {
        try {
            const novoFuncionario = await cadastrarFuncionarioApi(dados);

            setFuncionarios((atuais) => [...atuais, novoFuncionario]);
            setFuncionarioSelecionado((atual) => atual ?? novoFuncionario.id);
            return { sucesso: true, mensagem: 'Funcionário cadastrado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível cadastrar o funcionário.'),
            };
        }
    }

    async function atualizarFuncionario(
        id: number,
        dados: DadosFuncionario
    ): Promise<ResultadoOperacao> {
        try {
            const funcionarioAtualizado = await atualizarFuncionarioApi(id, dados);

            setFuncionarios((atuais) => atuais.map((funcionario) =>
                funcionario.id === id ? funcionarioAtualizado : funcionario
            ));
            setVendas((atuais) => atuais.map((venda) =>
                venda.funcionario.id === id
                    ? { ...venda, funcionario: funcionarioAtualizado }
                    : venda
            ));

            if (usuario?.id === id) {
                setUsuario({
                    id: funcionarioAtualizado.id,
                    nome: funcionarioAtualizado.nome,
                    cargo: funcionarioAtualizado.cargo,
                });
            }

            return { sucesso: true, mensagem: 'Funcionário atualizado.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível atualizar o funcionário.'),
            };
        }
    }

    async function excluirFuncionario(id: number): Promise<ResultadoOperacao> {
        if (usuario?.id === id) {
            return {
                sucesso: false,
                mensagem: 'Não é possível excluir o funcionário que está usando o aplicativo.',
            };
        }

        try {
            await excluirFuncionarioApi(id);

            const funcionariosRestantes = funcionarios.filter(
                (funcionario) => funcionario.id !== id
            );
            setFuncionarios(funcionariosRestantes);

            if (funcionarioSelecionado === id) {
                setFuncionarioSelecionado(funcionariosRestantes[0]?.id ?? null);
            }

            return { sucesso: true, mensagem: 'Funcionário excluído.' };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'Não foi possível excluir o funcionário.'),
            };
        }
    }

    async function perguntar(pergunta: string): Promise<ResultadoOperacao> {
        try {
            const resposta = await perguntarAoAssistente(pergunta);
            return { sucesso: true, mensagem: resposta };
        } catch (erro) {
            encerrarSeTokenExpirou(erro);
            return {
                sucesso: false,
                mensagem: mensagemDoErro(erro, 'O assistente não respondeu.'),
            };
        }
    }

    function encerrarSeTokenExpirou(erro: unknown) {
        if (erro instanceof ErroApi && erro.status === 401) {
            sair();
        }
    }

    function mensagemDoErro(erro: unknown, mensagemPadrao: string) {
        if (erro instanceof ErroApi) {
            return erro.message;
        }

        if (erro instanceof TypeError) {
            return 'Não foi possível conectar ao servidor. Confira se a API está ligada.';
        }

        if (erro instanceof Error && erro.message.trim() !== '') {
            return erro.message;
        }

        return mensagemPadrao;
    }

    if (usuario === null) {
        return (
            <View style={styles.container}>
                <StatusBar style='dark' />
                <Login onEntrar={entrar} modoDemo={MODO_DEMO} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style='dark' />

            <View style={styles.conteudo}>
                {
                    telaAtual === 'inicio' && (
                        <Inicio
                            quantidadeProdutos={produtos.length}
                            quantidadeClientes={clientes.length}
                            quantidadeVendas={vendas.length}
                            onAbrirVendas={() => setTelaAtual('vendas')}
                        />
                    )
                }

                {
                    telaAtual === 'vendas' && (
                        <Vendas
                            produtos={produtos}
                            clientes={clientes}
                            funcionarios={funcionarios}
                            vendas={vendas}
                            quantidades={quantidades}
                            clienteSelecionado={clienteSelecionado}
                            funcionarioSelecionado={funcionarioSelecionado}
                            onAlterarQuantidade={alterarQuantidade}
                            onSelecionarCliente={setClienteSelecionado}
                            onSelecionarFuncionario={setFuncionarioSelecionado}
                            onFinalizar={finalizarVenda}
                        />
                    )
                }

                {
                    telaAtual === 'produtos' && (
                        <Produtos
                            produtos={produtos}
                            onCadastrar={cadastrarProduto}
                            onAtualizar={atualizarProduto}
                            onExcluir={excluirProduto}
                        />
                    )
                }

                {
                    telaAtual === 'mais' && (
                        <Mais
                            clientes={clientes}
                            funcionarios={funcionarios}
                            usuario={usuario}
                            onAbrirClientes={() => setTelaAtual('clientes')}
                            onAbrirFuncionarios={() => setTelaAtual('funcionarios')}
                            onPerguntar={perguntar}
                        />
                    )
                }

                {
                    telaAtual === 'configuracoes' && (
                        <Configuracoes
                            usuario={usuario}
                            modoDemo={MODO_DEMO}
                            onAtualizarDados={atualizarDados}
                            onReiniciarDemonstracao={reiniciarDadosDemo}
                            onAbrirPrivacidade={() => setTelaAtual('privacidade')}
                            onSair={sair}
                        />
                    )
                }

                {
                    telaAtual === 'privacidade' && (
                        <Privacidade onVoltar={() => setTelaAtual('configuracoes')} />
                    )
                }

                {
                    telaAtual === 'clientes' && (
                        <Clientes
                            clientes={clientes}
                            onVoltar={() => setTelaAtual('mais')}
                            onCadastrar={cadastrarCliente}
                            onAtualizar={atualizarCliente}
                            onExcluir={excluirCliente}
                        />
                    )
                }

                {
                    telaAtual === 'funcionarios' && (
                        <Funcionarios
                            funcionarios={funcionarios}
                            usuarioLogadoId={usuario.id}
                            onVoltar={() => setTelaAtual('mais')}
                            onCadastrar={cadastrarFuncionario}
                            onAtualizar={atualizarFuncionario}
                            onExcluir={excluirFuncionario}
                        />
                    )
                }
            </View>

            <Menu telaAtual={telaAtual} onMudarTela={setTelaAtual} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },

    conteudo: {
        flex: 1,
    },
});
