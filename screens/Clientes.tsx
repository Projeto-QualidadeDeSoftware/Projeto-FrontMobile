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
import { Cliente } from '../models/Cliente';
import { cores } from '../theme/tema';
import { avisar, confirmar } from '../utils/dialogos';
import { aplicarMascaraCpf, aplicarMascaraTelefone } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type ClientesProps = {
    clientes: Cliente[],
    onVoltar: () => void,
    onCadastrar: (cliente: Omit<Cliente, 'id'>) => Promise<ResultadoOperacao>,
    onAtualizar: (id: number, cliente: Omit<Cliente, 'id'>) => Promise<ResultadoOperacao>,
    onExcluir: (id: number) => Promise<ResultadoOperacao>
}

export default function Clientes({
    clientes,
    onVoltar,
    onCadastrar,
    onAtualizar,
    onExcluir,
}: ClientesProps) {
    const lista = useRef<FlatList<Cliente>>(null);
    const[nome, setNome] = useState('');
    const[cpf, setCpf] = useState('');
    const[email, setEmail] = useState('');
    const[telefone, setTelefone] = useState('');
    const[clienteEmEdicao, setClienteEmEdicao] = useState<number | null>(null);
    const[erro, setErro] = useState('');
    const[mensagem, setMensagem] = useState('');
    const[salvando, setSalvando] = useState(false);

    async function salvar() {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const telefoneLimpo = telefone.replace(/\D/g, '');
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

        if (
            nome.trim() === '' ||
            cpfLimpo.length !== 11 ||
            !emailValido ||
            telefoneLimpo.length < 10
        ) {
            setMensagem('');
            setErro('Preencha nome, CPF, e-mail e telefone corretamente.');
            return;
        }

        setSalvando(true);
        setErro('');
        setMensagem('');

        const dados = {
            nome: nome.trim(),
            cpf: cpfLimpo,
            email: email.trim(),
            telefone: telefoneLimpo,
        };

        const resultado = clienteEmEdicao === null
            ? await onCadastrar(dados)
            : await onAtualizar(clienteEmEdicao, dados);

        setSalvando(false);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
            return;
        }

        limparCampos();
        setMensagem(resultado.mensagem);
    }

    function editar(cliente: Cliente) {
        setClienteEmEdicao(cliente.id);
        setNome(cliente.nome);
        setCpf(aplicarMascaraCpf(cliente.cpf));
        setEmail(cliente.email);
        setTelefone(aplicarMascaraTelefone(cliente.telefone));
        setErro('');
        setMensagem('');
        lista.current?.scrollToOffset({ offset: 0, animated: true });
    }

    function limparCampos() {
        setClienteEmEdicao(null);
        setNome('');
        setCpf('');
        setEmail('');
        setTelefone('');
        setErro('');
    }

    function cancelarEdicao() {
        limparCampos();
        setMensagem('');
    }

    function confirmarExclusao(cliente: Cliente) {
        confirmar(
            'Excluir cliente',
            `Deseja excluir ${cliente.nome}?`,
            async () => {
                const resultado = await onExcluir(cliente.id);

                if (!resultado.sucesso) {
                    avisar('Não foi possível excluir', resultado.mensagem);
                    return;
                }

                if (clienteEmEdicao === cliente.id) {
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
                data={clientes}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.conteudo}
                ListHeaderComponent={
                    <View>
                        <Pressable style={styles.voltar} onPress={onVoltar}>
                            <Ionicons name='arrow-back' size={20} color={cores.azul} />
                            <Text style={styles.textoVoltar}>Mais</Text>
                        </Pressable>

                        <Text style={styles.titulo}>Clientes</Text>
                        <Text style={styles.subtitulo}>Cadastre e mantenha os dados dos clientes</Text>

                        <View style={styles.formulario}>
                            <View style={styles.tituloFormularioLinha}>
                                <View style={styles.iconeTitulo}>
                                    <Ionicons
                                        name={clienteEmEdicao === null ? 'person-add-outline' : 'create-outline'}
                                        size={21}
                                        color={cores.laranja}
                                    />
                                </View>
                                <Text style={styles.tituloFormulario}>
                                    {clienteEmEdicao === null ? 'Novo cliente' : 'Editar cliente'}
                                </Text>
                            </View>

                            <Text style={styles.label}>Nome completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ex.: Maria Fernandes da Silva'
                                placeholderTextColor={cores.placeholder}
                                value={nome}
                                onChangeText={setNome}
                            />

                            <Text style={styles.label}>CPF</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='000.000.000-00'
                                placeholderTextColor={cores.placeholder}
                                keyboardType='number-pad'
                                maxLength={14}
                                value={cpf}
                                onChangeText={(texto) => setCpf(aplicarMascaraCpf(texto))}
                            />

                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='cliente@email.com'
                                placeholderTextColor={cores.placeholder}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                value={email}
                                onChangeText={(texto) => setEmail(texto.toLowerCase())}
                            />

                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='(18) 99999-9999'
                                placeholderTextColor={cores.placeholder}
                                keyboardType='phone-pad'
                                maxLength={15}
                                value={telefone}
                                onChangeText={(texto) => setTelefone(aplicarMascaraTelefone(texto))}
                            />

                            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
                            {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

                            <View style={styles.areaBotao}>
                                <Botao
                                    titulo={
                                        salvando
                                            ? 'Salvando...'
                                            : clienteEmEdicao === null
                                                ? 'Cadastrar cliente'
                                                : 'Salvar alterações'
                                    }
                                    onPress={salvar}
                                    desabilitado={salvando}
                                />
                            </View>

                            {clienteEmEdicao !== null && (
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
                                <Ionicons name='people-outline' size={22} color={cores.azul} />
                                <Text style={styles.tituloLista}>Clientes cadastrados</Text>
                            </View>
                            <Text style={styles.quantidade}>{clientes.length}</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardPessoa}>
                        <View style={styles.avatar}>
                            <Text style={styles.iniciais}>{item.nome.slice(0, 2).toUpperCase()}</Text>
                        </View>

                        <View style={styles.dadosPessoa}>
                            <Text style={styles.nomePessoa}>{item.nome}</Text>
                            <Text style={styles.informacaoPessoa}>
                                CPF: {aplicarMascaraCpf(item.cpf)}
                            </Text>
                            <Text style={styles.informacaoPessoa}>{item.email}</Text>
                            <Text style={styles.informacaoPessoa}>
                                {aplicarMascaraTelefone(item.telefone)}
                            </Text>
                        </View>

                        <View style={styles.acoes}>
                            <Pressable style={styles.botaoAcao} onPress={() => editar(item)}>
                                <Text style={styles.textoEditar}>Editar</Text>
                            </Pressable>
                            <Pressable style={styles.botaoAcao} onPress={() => confirmarExclusao(item)}>
                                <Text style={styles.textoExcluir}>Excluir</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.listaVazia}>
                        <Text style={styles.textoListaVazia}>Nenhum cliente cadastrado</Text>
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
    nomePessoa: { color: cores.azul, fontSize: 16, fontWeight: 'bold' },
    informacaoPessoa: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },
    acoes: { alignItems: 'flex-end', gap: 5 },
    botaoAcao: { minHeight: 31, justifyContent: 'center', paddingHorizontal: 6 },
    textoEditar: { color: cores.azul, fontSize: 13, fontWeight: 'bold' },
    textoExcluir: { color: cores.perigo, fontSize: 13, fontWeight: 'bold' },
    listaVazia: { backgroundColor: cores.card, borderRadius: 10, padding: 20, alignItems: 'center' },
    textoListaVazia: { color: cores.textoSuave },
});
