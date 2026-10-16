import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Botao from '../components/Botao';
import { cores } from '../theme/tema';
import { aplicarMascaraCpf } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type LoginProps = {
    onEntrar: (cpf: string, senha: string) => Promise<ResultadoOperacao>
}

export default function Login({ onEntrar }: LoginProps) {
    const[cpf, setCpf] = useState('');
    const[senha, setSenha] = useState('');
    const[erro, setErro] = useState('');
    const[carregando, setCarregando] = useState(false);

    async function enviar() {
        if (cpf.trim() === '' || senha === '') {
            setErro('Informe o CPF e a senha.');
            return;
        }

        setCarregando(true);
        setErro('');
        const resultado = await onEntrar(cpf.replace(/\D/g, ''), senha);
        setCarregando(false);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.marca}>
                <Text style={styles.nomeMarca}>Prontê</Text>
                <Text style={styles.descricaoMarca}>Gestão rápida para sua loja</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.titulo}>Entrar</Text>
                <Text style={styles.subtitulo}>Use o CPF e a senha cadastrados na API.</Text>

                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={styles.input}
                    placeholder='000.000.000-00'
                    placeholderTextColor={cores.placeholder}
                    keyboardType='number-pad'
                    value={cpf}
                    onChangeText={(texto) => setCpf(aplicarMascaraCpf(texto))}
                    maxLength={14}
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Digite sua senha'
                    placeholderTextColor={cores.placeholder}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    onSubmitEditing={enviar}
                />

                {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

                <View style={styles.areaBotao}>
                    <Botao
                        titulo={carregando ? 'Entrando...' : 'Entrar no sistema'}
                        onPress={enviar}
                        desabilitado={carregando}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        justifyContent: 'center',
        padding: 24,
    },

    marca: {
        alignItems: 'center',
        marginBottom: 24,
    },

    nomeMarca: {
        color: cores.azul,
        fontSize: 38,
        fontWeight: 'bold',
    },

    descricaoMarca: {
        color: cores.textoSuave,
        fontSize: 15,
        marginTop: 4,
    },

    card: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 16,
        padding: 20,
    },

    titulo: {
        color: cores.azul,
        fontSize: 25,
        fontWeight: 'bold',
    },

    subtitulo: {
        color: cores.textoSuave,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 10,
    },

    label: {
        color: cores.azulClaro,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 5,
    },

    input: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: '#FFFBF6',
        borderRadius: 9,
        paddingHorizontal: 12,
        color: cores.texto,
        fontSize: 16,
    },

    erro: {
        color: cores.perigo,
        fontWeight: 'bold',
        marginTop: 12,
    },

    areaBotao: {
        marginTop: 18,
    },
});
