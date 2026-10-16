import { useRef, useState } from 'react';
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
import { Funcionario } from '../models/Funcionario';
import { DadosFuncionario } from '../services/api';
import { cores } from '../theme/tema';
import { formatarMoeda } from '../utils/formatacao';
import { avisar, confirmar } from '../utils/dialogos';
import { aplicarMascaraCpf } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type FuncionariosProps = {
    funcionarios: Funcionario[],
    usuarioLogadoId: number,
    onVoltar: () => void,
    onCadastrar: (funcionario: DadosFuncionario) => Promise<ResultadoOperacao>,
    onAtualizar: (id: number, funcionario: DadosFuncionario) => Promise<ResultadoOperacao>,
    onExcluir: (id: number) => Promise<ResultadoOperacao>
}

export default function Funcionarios({
    funcionarios,
    usuarioLogadoId,
    onVoltar,
    onCadastrar,
    onAtualizar,
    onExcluir,
}: FuncionariosProps) {
    const lista = useRef<FlatList<Funcionario>>(null);
    const[nome, setNome] = useState('');
    const[cpf, setCpf] = useState('');
    const[cargo, setCargo] = useState('');
    const[senha, setSenha] = useState('');
    const[salario, setSalario] = useState('');
    const[funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<number | null>(null);
    const[erro, setErro] = useState('');
    const[mensagem, setMensagem] = useState('');
    const[salvando, setSalvando] = useState(false);

    async function salvar() {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const salarioConvertido = Number(salario.replace(',', '.'));

        if (
            nome.trim().length < 3 ||
            cpfLimpo.length !== 11 ||
            cargo.trim() === '' ||
            senha.length < 4 ||
            !Number.isFinite(salarioConvertido) ||
            salarioConvertido <= 0
        ) {
            setMensagem('');
            setErro('Preencha os dados corretamente. A senha precisa ter pelo menos 4 caracteres.');
            return;
        }

        setSalvando(true);
        setErro('');
        setMensagem('');

        const dados: DadosFuncionario = {
            nome: nome.trim(),
            cpf: cpfLimpo,
            cargo: cargo.trim(),
            senha,
            salario: salarioConvertido,
        };

        const resultado = funcionarioEmEdicao === null
            ? await onCadastrar(dados)
            : await onAtualizar(funcionarioEmEdicao, dados);

        setSalvando(false);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
            return;
        }

        limparCampos();
        setMensagem(resultado.mensagem);
    }

    function editar(funcionario: Funcionario) {
        setFuncionarioEmEdicao(funcionario.id);
        setNome(funcionario.nome);
        setCpf(aplicarMascaraCpf(funcionario.cpf));
        setCargo(funcionario.cargo);
        setSenha('');
        setSalario(funcionario.salario?.toString().replace('.', ',') ?? '');
        setErro('');
        setMensagem('');
        lista.current?.scrollToOffset({ offset: 0, animated: true });
    }

    function limparCampos() {
        setFuncionarioEmEdicao(null);
        setNome('');
        setCpf('');
        setCargo('');
        setSenha('');
        setSalario('');
        setErro('');
    }

    function cancelarEdicao() {
        limparCampos();
        setMensagem('');
    }

    function confirmarExclusao(funcionario: Funcionario) {
        confirmar(
            'Excluir funcionário',
            `Deseja excluir ${funcionario.nome}?`,
            async () => {
                const resultado = await onExcluir(funcionario.id);

                if (!resultado.sucesso) {
                    avisar('Não foi possível excluir', resultado.mensagem);
                    return;
                }

                if (funcionarioEmEdicao === funcionario.id) {
                    limparCampos();
                }

                setMensagem(resultado.mensagem);
            }
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                ref={lista}
                data={funcionarios}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.conteudo}
                ListHeaderComponent={
                    <View>
                        <Pressable style={styles.voltar} onPress={onVoltar}>
                            <Ionicons name='arrow-back' size={20} color={cores.azul} />
                            <Text style={styles.textoVoltar}>Mais</Text>
                        </Pressable>

                        <Text style={styles.titulo}>Funcionários</Text>
                        <Text style={styles.subtitulo}>Gerencie a equipe e os acessos ao sistema</Text>

                        <View style={styles.formulario}>
                            <View style={styles.tituloFormularioLinha}>
                                <View style={styles.iconeTitulo}>
                                    <Ionicons
                                        name={funcionarioEmEdicao === null ? 'person-add-outline' : 'create-outline'}
                                        size={21}
                                        color={cores.laranja}
                                    />
                                </View>
                                <Text style={styles.tituloFormulario}>
                                    {funcionarioEmEdicao === null ? 'Novo funcionário' : 'Editar funcionário'}
                                </Text>
                            </View>

                            <Text style={styles.label}>Nome completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ex.: Carlos Pereira'
                                placeholderTextColor={cores.placeholder}
                                value={nome}
                                onChangeText={setNome}
                            />

                            <Text style={styles.label}>CPF de acesso</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='000.000.000-00'
                                placeholderTextColor={cores.placeholder}
                                keyboardType='number-pad'
                                maxLength={14}
                                value={cpf}
                                onChangeText={(texto) => setCpf(aplicarMascaraCpf(texto))}
                            />

                            <Text style={styles.label}>Cargo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ex.: Vendedor'
                                placeholderTextColor={cores.placeholder}
                                value={cargo}
                                onChangeText={setCargo}
                            />

                            <View style={styles.linhaCampos}>
                                <View style={styles.campoMetade}>
                                    <Text style={styles.label}>
                                        {funcionarioEmEdicao === null ? 'Senha' : 'Nova senha'}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Mínimo 4 caracteres'
                                        placeholderTextColor={cores.placeholder}
                                        secureTextEntry
                                        value={senha}
                                        onChangeText={setSenha}
                                    />
                                </View>

                                <View style={styles.campoMetade}>
                                    <Text style={styles.label}>Salário</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='2500,00'
                                        placeholderTextColor={cores.placeholder}
                                        keyboardType='decimal-pad'
                                        value={salario}
                                        onChangeText={setSalario}
                                    />
                                </View>
                            </View>

                            {funcionarioEmEdicao !== null && (
                                <Text style={styles.ajudaSenha}>
                                    A API exige uma nova senha ao atualizar um funcionário.
                                </Text>
                            )}

                            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
                            {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

                            <View style={styles.areaBotao}>
                                <Botao
                                    titulo={
                                        salvando
                                            ? 'Salvando...'
                                            : funcionarioEmEdicao === null
                                                ? 'Cadastrar funcionário'
                                                : 'Salvar alterações'
                                    }
                                    onPress={salvar}
                                    desabilitado={salvando}
                                />
                            </View>

                            {funcionarioEmEdicao !== null && (
                                <View style={styles.areaCancelar}>
                                    <Botao
                                        titulo='Cancelar edição'
                                        onPress={cancelarEdicao}
                                        variante='secundario'
                                        desabilitado={salvando}
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.cabecalhoLista}>
                            <View style={styles.tituloListaLinha}>
                                <Ionicons name='briefcase-outline' size={22} color={cores.azul} />
                                <Text style={styles.tituloLista}>Equipe cadastrada</Text>
                            </View>
                            <Text style={styles.quantidade}>{funcionarios.length}</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardPessoa}>
                        <View style={styles.avatar}>
                            <Text style={styles.iniciais}>{item.nome.slice(0, 2).toUpperCase()}</Text>
                        </View>

                        <View style={styles.dadosPessoa}>
                            <View style={styles.nomeLinha}>
                                <Text style={styles.nomePessoa}>{item.nome}</Text>
                                {item.id === usuarioLogadoId && <Text style={styles.voce}>VOCÊ</Text>}
                            </View>
                            <Text style={styles.informacaoPessoa}>{item.cargo}</Text>
                            <Text style={styles.informacaoPessoa}>
                                CPF: {aplicarMascaraCpf(item.cpf)}
                            </Text>
                            <Text style={styles.salario}>{formatarMoeda(item.salario)}</Text>
                        </View>

                        <View style={styles.acoes}>
                            <Pressable style={styles.botaoAcao} onPress={() => editar(item)}>
                                <Text style={styles.textoEditar}>Editar</Text>
                            </Pressable>
                            <Pressable
                                style={styles.botaoAcao}
                                onPress={() => confirmarExclusao(item)}
                                disabled={item.id === usuarioLogadoId}
                            >
                                <Text style={item.id === usuarioLogadoId ? styles.textoDesabilitado : styles.textoExcluir}>
                                    Excluir
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.listaVazia}>
                        <Text style={styles.textoListaVazia}>Nenhum funcionário cadastrado</Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    conteudo: { padding: 20, paddingTop: 46, paddingBottom: 32 },
    voltar: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 13 },
    textoVoltar: { color: cores.azul, fontSize: 14, fontWeight: 'bold' },
    titulo: { color: cores.azul, fontSize: 29, fontWeight: 'bold' },
    subtitulo: { color: cores.textoSuave, fontSize: 15, marginTop: 4, marginBottom: 18 },
    formulario: { backgroundColor: cores.card, borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 16 },
    tituloFormularioLinha: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 4 },
    iconeTitulo: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center' },
    tituloFormulario: { color: cores.azul, fontSize: 20, fontWeight: 'bold' },
    label: { color: cores.azulClaro, fontSize: 14, fontWeight: 'bold', marginTop: 11, marginBottom: 5 },
    input: { width: '100%', minHeight: 45, borderWidth: 1, borderColor: cores.borda, backgroundColor: '#FFFBF6', borderRadius: 8, paddingHorizontal: 12, fontSize: 15, color: cores.texto },
    linhaCampos: { flexDirection: 'row', gap: 10 },
    campoMetade: { flex: 1 },
    ajudaSenha: { color: cores.textoSuave, fontSize: 12, lineHeight: 17, marginTop: 8 },
    erro: { color: cores.perigo, fontWeight: 'bold', marginTop: 10 },
    sucesso: { color: cores.verde, fontWeight: 'bold', marginTop: 10 },
    areaBotao: { marginTop: 14 },
    areaCancelar: { marginTop: 8 },
    cabecalhoLista: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 11 },
    tituloListaLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    tituloLista: { color: cores.azul, fontSize: 20, fontWeight: 'bold' },
    quantidade: { color: cores.textoSuave, fontSize: 13 },
    cardPessoa: { backgroundColor: cores.card, borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
    avatar: { width: 46, height: 46, borderRadius: 10, backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
    iniciais: { color: cores.azul, fontSize: 16, fontWeight: 'bold' },
    dadosPessoa: { flex: 1, paddingRight: 5 },
    nomeLinha: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    nomePessoa: { color: cores.azul, fontSize: 16, fontWeight: 'bold' },
    voce: { color: cores.verde, backgroundColor: cores.verdeClaro, borderRadius: 9, paddingHorizontal: 6, paddingVertical: 2, fontSize: 9, fontWeight: 'bold' },
    informacaoPessoa: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },
    salario: { color: cores.azul, fontSize: 13, fontWeight: 'bold', marginTop: 5 },
    acoes: { alignItems: 'flex-end', gap: 5 },
    botaoAcao: { minHeight: 31, justifyContent: 'center', paddingHorizontal: 6 },
    textoEditar: { color: cores.azul, fontSize: 13, fontWeight: 'bold' },
    textoExcluir: { color: cores.perigo, fontSize: 13, fontWeight: 'bold' },
    textoDesabilitado: { color: cores.placeholder, fontSize: 13, fontWeight: 'bold' },
    listaVazia: { backgroundColor: cores.card, borderRadius: 10, padding: 20, alignItems: 'center' },
    textoListaVazia: { color: cores.textoSuave },
});
