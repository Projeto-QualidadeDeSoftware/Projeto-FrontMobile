import { useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Botao from '../components/Botao';
import CardProdutoVenda from '../components/CardProdutoVenda';
import SeletorBusca from '../components/SeletorBusca';
import { Cliente } from '../models/Cliente';
import { Funcionario } from '../models/Funcionario';
import { Produto } from '../models/Produto';
import { Venda } from '../models/Venda';
import { cores } from '../theme/tema';
import { formatarData, formatarMoeda } from '../utils/formatacao';
import { avisar } from '../utils/dialogos';
import { aplicarMascaraCpf } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type VendasProps = {
    produtos: Produto[],
    clientes: Cliente[],
    funcionarios: Funcionario[],
    vendas: Venda[],
    quantidades: Record<number, number>,
    clienteSelecionado: number | null,
    funcionarioSelecionado: number | null,
    onAlterarQuantidade: (id: number, quantidade: number) => void,
    onSelecionarCliente: (id: number) => void,
    onSelecionarFuncionario: (id: number) => void,
    onFinalizar: () => Promise<ResultadoOperacao>
}

export default function Vendas({
    produtos,
    clientes,
    funcionarios,
    vendas,
    quantidades,
    clienteSelecionado,
    funcionarioSelecionado,
    onAlterarQuantidade,
    onSelecionarCliente,
    onSelecionarFuncionario,
    onFinalizar
}: VendasProps) {

    const[aba, setAba] = useState<'nova' | 'historico'>('nova');
    const[finalizando, setFinalizando] = useState(false);

    const quantidadeTotal = Object.values(quantidades)
        .reduce((soma, quantidade) => soma + quantidade, 0);

    const total = useMemo(() => {
        return produtos.reduce(
            (soma, produto) => soma + produto.preco * (quantidades[produto.id] ?? 0),
            0
        );
    }, [produtos, quantidades]);

    async function finalizar() {
        setFinalizando(true);
        const resultado = await onFinalizar();
        setFinalizando(false);

        avisar(
            resultado.sucesso ? 'Venda registrada' : 'Não foi possível finalizar',
            resultado.mensagem
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Vendas</Text>
            <Text style={styles.subtitulo}>Registre e consulte as vendas da loja</Text>

            <View style={styles.abas}>
                <Pressable
                    style={[styles.aba, aba === 'nova' && styles.abaSelecionada]}
                    onPress={() => setAba('nova')}
                >
                    <Text style={[styles.textoAba, aba === 'nova' && styles.textoAbaSelecionada]}>
                        Nova venda
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.aba, aba === 'historico' && styles.abaSelecionada]}
                    onPress={() => setAba('historico')}
                >
                    <Text style={[styles.textoAba, aba === 'historico' && styles.textoAbaSelecionada]}>
                        Histórico
                    </Text>
                </Pressable>
            </View>

            {
                aba === 'nova' ? (
                    <View>
                        <Text style={styles.tituloSecao}>1. Escolha o cliente</Text>
                        <SeletorBusca
                            opcoes={clientes.map((cliente) => ({
                                id: cliente.id,
                                titulo: cliente.nome,
                                descricao: `CPF: ${aplicarMascaraCpf(cliente.cpf)}`,
                            }))}
                            selecionadoId={clienteSelecionado}
                            placeholder='Selecione um cliente'
                            placeholderBusca='Pesquisar por nome ou CPF'
                            onSelecionar={onSelecionarCliente}
                        />

                        <Text style={styles.tituloSecao}>2. Escolha o vendedor</Text>
                        <SeletorBusca
                            opcoes={funcionarios.map((funcionario) => ({
                                id: funcionario.id,
                                titulo: funcionario.nome,
                                descricao: `${funcionario.cargo} · ${aplicarMascaraCpf(funcionario.cpf)}`,
                            }))}
                            selecionadoId={funcionarioSelecionado}
                            placeholder='Selecione um vendedor'
                            placeholderBusca='Pesquisar por nome, cargo ou CPF'
                            onSelecionar={onSelecionarFuncionario}
                        />

                        <View style={styles.cabecalhoProdutos}>
                            <Text style={styles.tituloSecao}>3. Escolha os produtos</Text>
                            <Text style={styles.quantidadeSelecionada}>
                                {quantidadeTotal} item(ns)
                            </Text>
                        </View>

                        {
                            produtos.map((produto) => (
                                <CardProdutoVenda
                                    key={produto.id}
                                    produto={produto}
                                    quantidade={quantidades[produto.id] ?? 0}
                                    onAlterarQuantidade={onAlterarQuantidade}
                                />
                            ))
                        }

                        <View style={styles.total}>
                            <Text style={styles.labelTotal}>TOTAL</Text>
                            <Text style={styles.valorTotal}>{formatarMoeda(total)}</Text>
                        </View>

                        <Botao
                            titulo={finalizando ? 'Finalizando...' : 'Finalizar venda'}
                            onPress={finalizar}
                            desabilitado={
                                finalizando ||
                                quantidadeTotal === 0 ||
                                clienteSelecionado === null ||
                                funcionarioSelecionado === null
                            }
                        />
                    </View>
                ) : (
                    <View style={styles.historico}>
                        <Text style={styles.tituloSecao}>Vendas realizadas</Text>

                        {
                            vendas.length === 0 ? (
                                <View style={styles.listaVazia}>
                                    <Text style={styles.tituloVazio}>Nenhuma venda registrada</Text>
                                    <Text style={styles.textoVazio}>
                                        As vendas finalizadas aparecerão aqui.
                                    </Text>
                                </View>
                            ) : (
                                vendas.map((venda) => {
                                    const quantidade = venda.itens.reduce(
                                        (soma, item) => soma + item.quantidade,
                                        0
                                    );

                                    return (
                                        <View key={venda.id} style={styles.cardVenda}>
                                            <View style={styles.linhaVenda}>
                                                <Text style={styles.numeroVenda}>Venda #{venda.id}</Text>
                                                <Text style={styles.valorVenda}>
                                                    {formatarMoeda(venda.valorTotal)}
                                                </Text>
                                            </View>
                                            <Text style={styles.informacaoVenda}>
                                                {formatarData(venda.dataVenda)} · {venda.cliente.nome}
                                            </Text>
                                            <Text style={styles.informacaoVenda}>
                                                Vendedor: {venda.funcionario.nome}
                                            </Text>
                                            <Text style={styles.itensVenda}>
                                                {quantidade} item(ns) em {venda.itens.length} produto(s)
                                            </Text>
                                        </View>
                                    );
                                })
                            )
                        }
                    </View>
                )
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 32,
    },

    titulo: {
        color: cores.azul,
        fontSize: 29,
        fontWeight: 'bold',
    },

    subtitulo: {
        color: cores.textoSuave,
        fontSize: 15,
        marginTop: 4,
    },

    abas: {
        backgroundColor: '#F0E8DF',
        borderRadius: 10,
        flexDirection: 'row',
        padding: 4,
        marginTop: 20,
    },

    aba: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 11,
        alignItems: 'center',
    },

    abaSelecionada: {
        backgroundColor: cores.card,
    },

    textoAba: {
        color: cores.textoSuave,
        fontWeight: 'bold',
    },

    textoAbaSelecionada: {
        color: cores.laranja,
    },

    tituloSecao: {
        color: cores.azul,
        fontSize: 19,
        fontWeight: 'bold',
        marginTop: 23,
        marginBottom: 10,
    },

    cabecalhoProdutos: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },

    quantidadeSelecionada: {
        color: cores.textoSuave,
        fontSize: 12,
        marginBottom: 12,
    },

    total: {
        backgroundColor: cores.azul,
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 12,
    },

    labelTotal: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },

    valorTotal: {
        color: cores.amarelo,
        fontSize: 26,
        fontWeight: 'bold',
    },

    historico: {
        paddingBottom: 10,
    },

    listaVazia: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 22,
        alignItems: 'center',
    },

    tituloVazio: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
    },

    textoVazio: {
        color: cores.textoSuave,
        marginTop: 5,
    },

    cardVenda: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },

    linhaVenda: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    numeroVenda: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
    },

    valorVenda: {
        color: cores.azul,
        fontSize: 18,
        fontWeight: 'bold',
    },

    informacaoVenda: {
        color: cores.textoSuave,
        fontSize: 14,
        marginTop: 5,
    },

    itensVenda: {
        alignSelf: 'flex-start',
        color: cores.verde,
        backgroundColor: cores.verdeClaro,
        borderRadius: 14,
        paddingVertical: 5,
        paddingHorizontal: 9,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 9,
    },
});
