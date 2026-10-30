import { useEffect, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../components/Botao';
import { cores } from '../theme/tema';
import { aplicarMascaraCpf } from '../utils/mascaras';

type ResultadoOperacao = {
    sucesso: boolean,
    mensagem: string
}

type LoginProps = {
    onEntrar: (cpf: string, senha: string) => Promise<ResultadoOperacao>,
    modoDemo: boolean
}

export default function Login({ onEntrar, modoDemo }: LoginProps) {
    const { width: larguraTela } = useWindowDimensions();
    const areaSegura = useSafeAreaInsets();
    const rolagem = useRef<ScrollView>(null);
    const senhaEmFoco = useRef(false);
    const[cpf, setCpf] = useState('');
    const[senha, setSenha] = useState('');
    const[mostrarSenha, setMostrarSenha] = useState(false);
    const[erro, setErro] = useState('');
    const[carregando, setCarregando] = useState(false);
    const larguraLogo = Math.min(280, Math.max(1, larguraTela - 64));

    useEffect(() => {
        const evento = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const inscricao = Keyboard.addListener(evento, () => {
            if (senhaEmFoco.current) {
                rolagem.current?.scrollToEnd({ animated: true });
            }
        });

        return () => inscricao.remove();
    }, []);

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

    async function abrirDemonstracao() {
        setCarregando(true);
        setErro('');
        const resultado = await onEntrar('', '');
        setCarregando(false);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                ref={rolagem}
                contentContainerStyle={[
                    styles.conteudo,
                    {
                        paddingTop: Math.max(32, areaSegura.top + 16),
                        paddingBottom: Math.max(32, areaSegura.bottom + 16),
                    },
                ]}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.limiteConteudo}>
                    <View style={styles.marca}>
                        <Image
                            source={require('../assets/pronte-logo-horizontal.png')}
                            style={{ width: larguraLogo, height: larguraLogo / 3 }}
                            resizeMode='contain'
                            accessibilityLabel='Prontê Conveniência'
                        />
                        <Text style={styles.descricaoMarca}>Gestão rápida para sua loja</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.titulo}>Entrar</Text>
                        <Text style={styles.subtitulo}>
                            {modoDemo
                                ? 'Use o acesso local para conhecer as telas sem depender do servidor.'
                                : 'Use o CPF e a senha cadastrados no sistema.'}
                        </Text>

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
                        <View style={styles.inputComIcone}>
                            <TextInput
                                style={styles.inputSenha}
                                placeholder='Digite sua senha'
                                placeholderTextColor={cores.placeholder}
                                secureTextEntry={!mostrarSenha}
                                value={senha}
                                onChangeText={setSenha}
                                onFocus={() => {
                                    senhaEmFoco.current = true;
                                }}
                                onBlur={() => {
                                    senhaEmFoco.current = false;
                                }}
                                onSubmitEditing={enviar}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='current-password'
                                returnKeyType='done'
                            />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.botaoOlho,
                                    pressed && styles.botaoOlhoPressionado,
                                ]}
                                onPress={() => setMostrarSenha((valor) => !valor)}
                                accessibilityRole='button'
                                accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                <Ionicons
                                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                    size={23}
                                    color={cores.azulClaro}
                                />
                            </Pressable>
                        </View>

                        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

                        <View style={styles.areaBotao}>
                            <Botao
                                titulo={carregando ? 'Entrando...' : 'Entrar no sistema'}
                                onPress={enviar}
                                desabilitado={carregando}
                            />
                        </View>

                        {modoDemo && (
                            <View style={styles.areaDemo}>
                                <View style={styles.divisor} />
                                <Text style={styles.tituloDemo}>Demonstração local</Text>
                                <Text style={styles.textoDemo}>
                                    Os dados de exemplo são apagados quando o aplicativo é reiniciado.
                                </Text>
                                <Botao
                                    titulo={carregando ? 'Abrindo...' : 'Entrar sem servidor'}
                                    onPress={abrirDemonstracao}
                                    variante='secundario'
                                    desabilitado={carregando}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },

    conteudo: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 32,
    },

    limiteConteudo: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
    },

    marca: {
        alignItems: 'center',
        marginBottom: 24,
    },

    descricaoMarca: {
        color: cores.textoSuave,
        fontSize: 15,
        marginTop: 7,
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

    inputComIcone: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: '#FFFBF6',
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },

    inputSenha: {
        flex: 1,
        minHeight: 48,
        paddingLeft: 12,
        paddingRight: 4,
        color: cores.texto,
        fontSize: 16,
    },

    botaoOlho: {
        width: 48,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoOlhoPressionado: {
        backgroundColor: '#F2EDE7',
    },

    erro: {
        color: cores.perigo,
        fontWeight: 'bold',
        marginTop: 12,
    },

    areaBotao: {
        marginTop: 18,
    },

    areaDemo: {
        marginTop: 18,
        gap: 9,
    },

    divisor: {
        height: 1,
        backgroundColor: cores.borda,
        marginBottom: 4,
    },

    tituloDemo: {
        color: cores.azul,
        fontSize: 15,
        fontWeight: 'bold',
    },

    textoDemo: {
        color: cores.textoSuave,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 2,
    },
});
