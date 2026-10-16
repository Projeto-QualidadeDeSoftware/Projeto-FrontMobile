import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import { Produto } from '../models/Produto';
import { cores } from '../theme/tema';
import { formatarMoeda } from '../utils/formatacao';
import { iconeDoProduto } from '../utils/icones';
import { avisar, confirmar } from '../utils/dialogos';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type ProdutosProps = {
    produtos: Produto[],
    onCadastrar: (produto: Omit<Produto, 'id'>) => Promise<ResultadoOperacao>,
    onAtualizar: (id: number, produto: Omit<Produto, 'id'>) => Promise<ResultadoOperacao>,
    onExcluir: (id: number) => Promise<ResultadoOperacao>
}

export default function Produtos({
    produtos,
    onCadastrar,
    onAtualizar,
    onExcluir
}: ProdutosProps) {

    const[nome, setNome] = useState('');
    const[descricao, setDescricao] = useState('');
    const[preco, setPreco] = useState('');
    const[estoque, setEstoque] = useState('');
    const[erro, setErro] = useState('');
    const[salvando, setSalvando] = useState(false);
    const[produtoEmEdicao, setProdutoEmEdicao] = useState<number | null>(null);

    async function salvar() {
        const precoConvertido = Number(preco.replace(',', '.'));
        const estoqueConvertido = Number(estoque);

        // Essa validação evita mandar um produto incompleto para o App ou para a API.
        if (
            nome.trim() === '' ||
            descricao.trim() === '' ||
            !Number.isFinite(precoConvertido) ||
            precoConvertido <= 0 ||
            !Number.isInteger(estoqueConvertido) ||
            estoqueConvertido < 0
        ) {
            setErro('Preencha os campos com valores válidos.');
            return;
        }

        setSalvando(true);
        const dados = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: precoConvertido,
            estoque: estoqueConvertido,
        };
        const resultado = produtoEmEdicao === null
            ? await onCadastrar(dados)
            : await onAtualizar(produtoEmEdicao, dados);
        setSalvando(false);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
            return;
        }

        limparFormulario();
    }

    function editar(produto: Produto) {
        setProdutoEmEdicao(produto.id);
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco.toString().replace('.', ','));
        setEstoque(produto.estoque.toString());
        setErro('');
    }

    function limparFormulario() {
        setProdutoEmEdicao(null);
        setNome('');
        setDescricao('');
        setPreco('');
        setEstoque('');
        setErro('');
    }

    function confirmarExclusao(produto: Produto) {
        confirmar(
            'Excluir produto',
            `Deseja excluir ${produto.nome}?`,
            async () => {
                const resultado = await onExcluir(produto.id);

                if (!resultado.sucesso) {
                    avisar('Não foi possível excluir', resultado.mensagem);
                }
            }
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.conteudo}
                ListHeaderComponent={
                    <View>
                        <Text style={styles.titulo}>Produtos</Text>
                        <Text style={styles.subtitulo}>Gerencie o catálogo e o estoque</Text>

                        <View style={styles.formulario}>
                            <View style={styles.tituloFormularioLinha}>
                                <View style={styles.iconeTitulo}>
                                    <Ionicons
                                        name={produtoEmEdicao === null ? 'add-circle-outline' : 'create-outline'}
                                        size={21}
                                        color={cores.laranja}
                                    />
                                </View>
                                <Text style={styles.tituloFormulario}>
                                    {produtoEmEdicao === null ? 'Novo produto' : 'Editar produto'}
                                </Text>
                            </View>

                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ex.: coxinha, café, suco, pizza ou sorvete'
                                placeholderTextColor={cores.placeholder}
                                value={nome}
                                onChangeText={setNome}
                            />

                            <Text style={styles.label}>Descrição</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ex.: bebida, salgado, doce, natural ou refeição'
                                placeholderTextColor={cores.placeholder}
                                value={descricao}
                                onChangeText={setDescricao}
                            />

                            <View style={styles.dicaIcone}>
                                <Ionicons name='sparkles-outline' size={18} color={cores.laranja} />
                                <Text style={styles.textoDicaIcone}>
                                    O ícone é automático. Palavras reconhecidas: café ou cappuccino;
                                    água, suco, refrigerante ou chá; sorvete ou picolé; chocolate,
                                    doce ou bala; coxinha, salgado, pão, esfirra, hambúrguer ou lanche;
                                    pizza; salada, fruta ou natural.
                                </Text>
                            </View>

                            <View style={styles.linhaCampos}>
                                <View style={styles.campoMetade}>
                                    <Text style={styles.label}>Preço</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='7,50'
                                        placeholderTextColor={cores.placeholder}
                                        keyboardType='decimal-pad'
                                        value={preco}
                                        onChangeText={setPreco}
                                    />
                                </View>

                                <View style={styles.campoMetade}>
                                    <Text style={styles.label}>Estoque</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='10'
                                        placeholderTextColor={cores.placeholder}
                                        keyboardType='number-pad'
                                        value={estoque}
                                        onChangeText={setEstoque}
                                    />
                                </View>
                            </View>

                            {
                                erro !== '' && (
                                    <Text style={styles.erro}>{erro}</Text>
                                )
                            }

                            <View style={styles.areaBotao}>
                                <Botao
                                    titulo={
                                        salvando
                                            ? 'Salvando...'
                                            : produtoEmEdicao === null
                                                ? 'Cadastrar produto'
                                                : 'Salvar alterações'
                                    }
                                    onPress={salvar}
                                    desabilitado={salvando}
                                />
                            </View>

                            {
                                produtoEmEdicao !== null && (
                                    <View style={styles.areaCancelar}>
                                        <Botao
                                            titulo='Cancelar edição'
                                            onPress={limparFormulario}
                                            variante='secundario'
                                            desabilitado={salvando}
                                        />
                                    </View>
                                )
                            }
                        </View>

                        <View style={styles.cabecalhoLista}>
                            <View style={styles.tituloListaLinha}>
                                <Ionicons name='cube-outline' size={22} color={cores.azul} />
                                <Text style={styles.tituloLista}>Catálogo</Text>
                            </View>
                            <Text style={styles.quantidade}>{produtos.length} produto(s)</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardProduto}>
                        <View style={styles.iconeProduto}>
                            <Ionicons
                                name={iconeDoProduto(item)}
                                size={23}
                                color={cores.azul}
                            />
                        </View>

                        <View style={styles.informacoesProduto}>
                            <Text style={styles.codigoProduto}>P{item.id.toString().padStart(3, '0')}</Text>
                            <Text style={styles.nomeProduto}>{item.nome}</Text>
                            <Text style={styles.descricaoProduto} numberOfLines={1}>
                                {item.descricao}
                            </Text>

                            <View style={styles.rodapeProduto}>
                                <Text style={styles.precoProduto}>{formatarMoeda(item.preco)}</Text>
                                <Text
                                    style={[
                                        styles.estoque,
                                        item.estoque <= 15 && styles.estoqueBaixo,
                                    ]}
                                >
                                    {item.estoque} em estoque
                                </Text>
                            </View>
                        </View>

                        <View style={styles.acoesProduto}>
                            <Pressable
                                style={styles.botaoAcao}
                                onPress={() => editar(item)}
                            >
                                <Text style={styles.textoEditar}>Editar</Text>
                            </Pressable>

                            <Pressable
                                style={styles.botaoAcao}
                                onPress={() => confirmarExclusao(item)}
                            >
                                <Text style={styles.textoExcluir}>Excluir</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.listaVazia}>
                        <Text style={styles.textoListaVazia}>Nenhum produto cadastrado</Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    conteudo: {
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
        marginBottom: 18,
    },

    formulario: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 16,
    },

    tituloFormulario: {
        color: cores.azul,
        fontSize: 20,
        fontWeight: 'bold',
    },

    tituloFormularioLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        marginBottom: 4,
    },

    iconeTitulo: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
    },

    label: {
        color: cores.azulClaro,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 11,
        marginBottom: 5,
    },

    input: {
        width: '100%',
        minHeight: 45,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: '#FFFBF6',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 15,
        color: cores.texto,
    },

    dicaIcone: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#FFF7F0',
        borderRadius: 8,
        padding: 10,
        marginTop: 9,
    },

    textoDicaIcone: {
        flex: 1,
        color: cores.textoSuave,
        fontSize: 12,
        lineHeight: 17,
    },

    linhaCampos: {
        flexDirection: 'row',
        gap: 10,
    },

    campoMetade: {
        flex: 1,
    },

    erro: {
        color: cores.perigo,
        fontWeight: 'bold',
        marginTop: 10,
    },

    areaBotao: {
        marginTop: 13,
    },

    areaCancelar: {
        marginTop: 8,
    },

    cabecalhoLista: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 11,
    },

    tituloLista: {
        color: cores.azul,
        fontSize: 21,
        fontWeight: 'bold',
    },

    tituloListaLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    quantidade: {
        color: cores.textoSuave,
        fontSize: 13,
    },

    cardProduto: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconeProduto: {
        width: 44,
        height: 44,
        borderRadius: 11,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    informacoesProduto: {
        flex: 1,
        paddingRight: 8,
    },

    codigoProduto: {
        color: cores.textoSuave,
        fontSize: 11,
    },

    nomeProduto: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 2,
    },

    descricaoProduto: {
        color: cores.textoSuave,
        fontSize: 13,
        marginTop: 3,
    },

    rodapeProduto: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        marginTop: 8,
    },

    precoProduto: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
    },

    estoque: {
        color: cores.verde,
        backgroundColor: cores.verdeClaro,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 11,
        fontWeight: 'bold',
    },

    estoqueBaixo: {
        color: cores.laranja,
        backgroundColor: '#FFF0E8',
    },

    acoesProduto: {
        alignItems: 'flex-end',
        gap: 5,
    },

    botaoAcao: {
        minHeight: 32,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },

    textoEditar: {
        color: cores.azul,
        fontSize: 13,
        fontWeight: 'bold',
    },

    textoExcluir: {
        color: cores.perigo,
        fontSize: 13,
        fontWeight: 'bold',
    },

    listaVazia: {
        backgroundColor: cores.card,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },

    textoListaVazia: {
        color: cores.textoSuave,
    },
});
