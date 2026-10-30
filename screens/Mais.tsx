import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import { UsuarioLogado } from '../models/Autenticacao';
import { Cliente } from '../models/Cliente';
import { Funcionario } from '../models/Funcionario';
import { cores } from '../theme/tema';
import { aplicarMascaraCpf, aplicarMascaraTelefone } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type MaisProps = {
    clientes: Cliente[],
    funcionarios: Funcionario[],
    usuario: UsuarioLogado,
    onAbrirClientes: () => void,
    onAbrirFuncionarios: () => void,
    onPerguntar: (pergunta: string) => Promise<ResultadoOperacao>
}

export default function Mais({
    clientes,
    funcionarios,
    usuario,
    onAbrirClientes,
    onAbrirFuncionarios,
    onPerguntar
}: MaisProps) {

    const[pergunta, setPergunta] = useState('');
    const[resposta, setResposta] = useState('');
    const[perguntando, setPerguntando] = useState(false);

    async function perguntar() {
        if (pergunta.trim() === '') {
            setResposta('Escreva uma pergunta sobre o estoque.');
            return;
        }

        setPerguntando(true);
        const resultado = await onPerguntar(pergunta.trim());
        setPerguntando(false);
        setResposta(resultado.mensagem);

        if (resultado.sucesso) {
            setPergunta('');
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps='handled'
        >
            <Text style={styles.titulo}>Mais</Text>
            <Text style={styles.subtitulo}>Equipe, clientes e assistente de estoque</Text>

            <View style={styles.cardUsuario}>
                <View style={styles.dadosUsuario}>
                    <Ionicons name='person-circle-outline' size={43} color='#FFFFFF' />
                    <View>
                        <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
                        <Text style={styles.cargoUsuario}>{usuario.cargo}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tituloSecaoLinha}>
                <Ionicons name='settings-outline' size={23} color={cores.azul} />
                <Text style={styles.tituloSecao}>Cadastros</Text>
            </View>

            <View style={styles.gradeCadastros}>
                <Pressable style={styles.cardCadastro} onPress={onAbrirClientes}>
                    <View style={styles.iconeCadastro}>
                        <Ionicons name='people-outline' size={24} color={cores.laranja} />
                    </View>
                    <Text style={styles.nomeCadastro}>Clientes</Text>
                    <Text style={styles.quantidadeCadastro}>{clientes.length} cadastrado(s)</Text>
                    <Text style={styles.abrirCadastro}>Gerenciar</Text>
                </Pressable>

                <Pressable style={styles.cardCadastro} onPress={onAbrirFuncionarios}>
                    <View style={styles.iconeCadastro}>
                        <Ionicons name='briefcase-outline' size={24} color={cores.laranja} />
                    </View>
                    <Text style={styles.nomeCadastro}>Funcionários</Text>
                    <Text style={styles.quantidadeCadastro}>{funcionarios.length} cadastrado(s)</Text>
                    <Text style={styles.abrirCadastro}>Gerenciar</Text>
                </Pressable>
            </View>

            <View style={styles.tituloSecaoLinha}>
                <Ionicons name='sparkles-outline' size={23} color={cores.azul} />
                <Text style={styles.tituloSecao}>Assistente de estoque</Text>
            </View>
            <View style={styles.cardAssistente}>
                <Text style={styles.textoAssistente}>
                    Pergunte sobre produtos com pouco estoque ou sobre a situação do catálogo.
                </Text>
                <TextInput
                    style={styles.inputPergunta}
                    placeholder='Ex.: Quais produtos estão com menos de 5 unidades?'
                    placeholderTextColor={cores.placeholder}
                    multiline
                    maxLength={500}
                    value={pergunta}
                    onChangeText={setPergunta}
                />
                <Botao
                    titulo={perguntando ? 'Consultando...' : 'Perguntar'}
                    onPress={perguntar}
                    desabilitado={perguntando}
                />

                {resposta !== '' && (
                    <View style={styles.resposta}>
                        <Text style={styles.labelResposta}>RESPOSTA</Text>
                        <Text style={styles.textoResposta}>{resposta}</Text>
                    </View>
                )}
            </View>

            <View style={styles.tituloSecaoLinha}>
                <Ionicons name='people-outline' size={23} color={cores.azul} />
                <Text style={styles.tituloSecao}>Clientes</Text>
            </View>
            {
                clientes.map((cliente) => (
                    <View key={cliente.id} style={styles.cardPessoa}>
                        <View style={styles.avatar}>
                            <Text style={styles.iniciais}>{cliente.nome.slice(0, 2).toUpperCase()}</Text>
                        </View>
                        <View style={styles.dadosPessoa}>
                            <Text style={styles.nomePessoa}>{cliente.nome}</Text>
                            <Text style={styles.informacaoPessoa}>
                                CPF: {aplicarMascaraCpf(cliente.cpf)}
                            </Text>
                            <Text style={styles.informacaoPessoa}>
                                {aplicarMascaraTelefone(cliente.telefone)}
                            </Text>
                        </View>
                    </View>
                ))
            }

            <View style={styles.tituloSecaoLinha}>
                <Ionicons name='briefcase-outline' size={23} color={cores.azul} />
                <Text style={styles.tituloSecao}>Funcionários</Text>
            </View>
            {
                funcionarios.map((funcionario) => (
                    <View key={funcionario.id} style={styles.cardPessoa}>
                        <View style={styles.avatar}>
                            <Text style={styles.iniciais}>
                                {funcionario.nome.slice(0, 2).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.dadosPessoa}>
                            <Text style={styles.nomePessoa}>{funcionario.nome}</Text>
                            <Text style={styles.informacaoPessoa}>{funcionario.cargo}</Text>
                            <Text style={styles.informacaoPessoa}>
                                CPF: {aplicarMascaraCpf(funcionario.cpf)}
                            </Text>
                        </View>
                    </View>
                ))
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

    cardUsuario: {
        backgroundColor: cores.azul,
        borderRadius: 12,
        padding: 16,
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dadosUsuario: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    nomeUsuario: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 4,
    },

    cargoUsuario: {
        color: '#D5DBE8',
        fontSize: 13,
        marginTop: 2,
    },

    tituloSecao: {
        color: cores.azul,
        fontSize: 21,
        fontWeight: 'bold',
    },

    tituloSecaoLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 23,
        marginBottom: 10,
    },

    gradeCadastros: {
        flexDirection: 'row',
        gap: 10,
    },

    cardCadastro: {
        flex: 1,
        minHeight: 154,
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 14,
    },

    iconeCadastro: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    nomeCadastro: {
        color: cores.azul,
        fontSize: 16,
        fontWeight: 'bold',
    },

    quantidadeCadastro: {
        color: cores.textoSuave,
        fontSize: 12,
        marginTop: 3,
    },

    abrirCadastro: {
        color: cores.laranja,
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 12,
    },

    cardAssistente: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 15,
    },

    textoAssistente: {
        color: cores.textoSuave,
        fontSize: 14,
        lineHeight: 20,
    },

    inputPergunta: {
        minHeight: 78,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: '#FFFBF6',
        borderRadius: 9,
        padding: 11,
        marginVertical: 12,
        color: cores.texto,
        textAlignVertical: 'top',
    },

    resposta: {
        backgroundColor: cores.verdeClaro,
        borderRadius: 9,
        padding: 12,
        marginTop: 12,
    },

    labelResposta: {
        color: cores.verde,
        fontSize: 11,
        fontWeight: 'bold',
    },

    textoResposta: {
        color: cores.texto,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
    },

    cardPessoa: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 9,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    iniciais: {
        color: cores.azul,
        fontSize: 18,
        fontWeight: 'bold',
    },

    dadosPessoa: {
        flex: 1,
    },

    nomePessoa: {
        color: cores.azul,
        fontSize: 16,
        fontWeight: 'bold',
    },

    informacaoPessoa: {
        color: cores.textoSuave,
        fontSize: 13,
        marginTop: 3,
    },

});
