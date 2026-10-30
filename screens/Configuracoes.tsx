import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Botao from '../components/Botao';
import { UsuarioLogado } from '../models/Autenticacao';
import { cores } from '../theme/tema';
import { confirmar } from '../utils/dialogos';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type ConfiguracoesProps = {
    usuario: UsuarioLogado,
    modoDemo: boolean,
    onAtualizarDados: () => Promise<ResultadoOperacao>,
    onReiniciarDemonstracao: () => Promise<ResultadoOperacao>,
    onAbrirPrivacidade: () => void,
    onSair: () => void
}

export default function Configuracoes({
    usuario,
    modoDemo,
    onAtualizarDados,
    onReiniciarDemonstracao,
    onAbrirPrivacidade,
    onSair,
}: ConfiguracoesProps) {
    const[processando, setProcessando] = useState(false);
    const[mensagem, setMensagem] = useState('');
    const[sucesso, setSucesso] = useState(true);
    const versaoAplicativo = Constants.expoConfig?.version ?? '1.0.0';

    async function atualizarDados() {
        setProcessando(true);
        setMensagem('');
        const resultado = await onAtualizarDados();
        setProcessando(false);
        setSucesso(resultado.sucesso);
        setMensagem(resultado.mensagem);
    }

    function reiniciarDemonstracao() {
        confirmar(
            'Reiniciar demonstração',
            'Os cadastros e vendas feitos neste teste serão apagados e os exemplos voltarão ao estado inicial.',
            async () => {
                setProcessando(true);
                setMensagem('');
                const resultado = await onReiniciarDemonstracao();
                setProcessando(false);
                setSucesso(resultado.sucesso);
                setMensagem(resultado.mensagem);
            },
            'Reiniciar'
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Configurações</Text>
            <Text style={styles.subtitulo}>Conta, dados e informações do aplicativo</Text>

            <View style={styles.cardUsuario}>
                <Ionicons name='person-circle-outline' size={52} color='#FFFFFF' />
                <View style={styles.dadosUsuario}>
                    <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
                    <Text style={styles.cargoUsuario}>{usuario.cargo}</Text>
                </View>
            </View>

            <Text style={styles.tituloSecao}>Sincronização</Text>
            <View style={styles.card}>
                <Text style={styles.textoCard}>
                    Busque novamente produtos, clientes, funcionários e vendas do sistema.
                </Text>
                <Botao
                    titulo={processando ? 'Sincronizando...' : 'Sincronizar dados'}
                    onPress={atualizarDados}
                    variante='secundario'
                    desabilitado={processando}
                />
            </View>

            {modoDemo && (
                <View style={styles.cardDemo}>
                    <View style={styles.cabecalhoCard}>
                        <Ionicons name='refresh-circle-outline' size={25} color={cores.laranja} />
                        <Text style={styles.tituloCard}>Dados de demonstração</Text>
                    </View>
                    <Text style={styles.textoCard}>
                        Restaure os exemplos originais para começar uma nova apresentação.
                    </Text>
                    <Botao
                        titulo='Reiniciar demonstração'
                        onPress={reiniciarDemonstracao}
                        variante='secundario'
                        desabilitado={processando}
                    />
                </View>
            )}

            {mensagem !== '' && (
                <View style={[styles.mensagem, !sucesso && styles.mensagemErro]}>
                    <Ionicons
                        name={sucesso ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                        size={20}
                        color={sucesso ? cores.verde : cores.perigo}
                    />
                    <Text style={[styles.textoMensagem, !sucesso && styles.textoMensagemErro]}>
                        {mensagem}
                    </Text>
                </View>
            )}

            <Text style={styles.tituloSecao}>Sessão</Text>
            <View style={styles.card}>
                <View style={styles.cabecalhoCard}>
                    <Ionicons name='shield-checkmark-outline' size={24} color={cores.azul} />
                    <Text style={styles.tituloCard}>Acesso ao sistema</Text>
                </View>
                <Text style={styles.textoCard}>
                    Encerre o acesso neste aparelho para voltar à tela de login.
                </Text>
                <Botao titulo='Sair da conta' onPress={onSair} variante='perigo' />
            </View>

            <Text style={styles.tituloSecao}>Ajuda e informações</Text>
            <View style={styles.card}>
                <View style={styles.cabecalhoCard}>
                    <Ionicons name='information-circle-outline' size={25} color={cores.azul} />
                    <View>
                        <Text style={styles.tituloCard}>Prontê Mobile</Text>
                        <Text style={styles.versao}>Versão {versaoAplicativo}</Text>
                    </View>
                </View>
                <Text style={styles.textoSobre}>
                    Aplicativo de apoio à gestão de vendas, estoque, clientes e equipe.
                </Text>
                <Botao
                    titulo='Privacidade e dados'
                    onPress={onAbrirPrivacidade}
                    variante='secundario'
                />
            </View>
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
        borderRadius: 14,
        padding: 17,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
    },

    dadosUsuario: {
        flex: 1,
    },

    nomeUsuario: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    cargoUsuario: {
        color: '#D5DBE8',
        fontSize: 13,
        marginTop: 3,
    },

    tituloSecao: {
        color: cores.azul,
        fontSize: 19,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 10,
    },

    card: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 13,
        padding: 16,
        gap: 12,
    },

    cardDemo: {
        backgroundColor: '#FFF9F1',
        borderWidth: 1,
        borderColor: '#F6CDBE',
        borderRadius: 13,
        padding: 16,
        gap: 12,
        marginTop: 12,
    },

    cabecalhoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    tituloCard: {
        color: cores.azul,
        fontSize: 16,
        fontWeight: 'bold',
    },

    textoCard: {
        color: cores.textoSuave,
        fontSize: 14,
        lineHeight: 20,
    },

    mensagem: {
        backgroundColor: cores.verdeClaro,
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    mensagemErro: {
        backgroundColor: cores.perigoClaro,
    },

    textoMensagem: {
        flex: 1,
        color: cores.verde,
        fontSize: 13,
        fontWeight: '600',
    },

    textoMensagemErro: {
        color: cores.perigo,
    },

    versao: {
        color: cores.textoSuave,
        fontSize: 12,
        marginTop: 2,
    },

    textoSobre: {
        color: cores.textoSuave,
        fontSize: 14,
        lineHeight: 20,
    },
});
