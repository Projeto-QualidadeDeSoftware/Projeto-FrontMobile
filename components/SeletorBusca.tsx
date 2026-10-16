import { useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/tema';

export type OpcaoSeletor = {
    id: number,
    titulo: string,
    descricao?: string
}

type SeletorBuscaProps = {
    opcoes: OpcaoSeletor[],
    selecionadoId: number | null,
    placeholder: string,
    placeholderBusca: string,
    onSelecionar: (id: number) => void
}

function normalizar(texto: string) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

export default function SeletorBusca({
    opcoes,
    selecionadoId,
    placeholder,
    placeholderBusca,
    onSelecionar,
}: SeletorBuscaProps) {
    const[aberto, setAberto] = useState(false);
    const[busca, setBusca] = useState('');

    const selecionada = opcoes.find((opcao) => opcao.id === selecionadoId);
    const opcoesFiltradas = useMemo(() => {
        const termo = normalizar(busca.trim());

        return opcoes
            .filter((opcao) => {
                const texto = normalizar(`${opcao.titulo} ${opcao.descricao ?? ''}`);
                return termo === '' || texto.includes(termo);
            })
            .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
    }, [busca, opcoes]);

    const opcoesVisiveis = opcoesFiltradas.slice(0, 30);

    function selecionar(id: number) {
        onSelecionar(id);
        setAberto(false);
        setBusca('');
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.campo, aberto && styles.campoAberto]}
                onPress={() => setAberto((atual) => !atual)}
            >
                <View style={styles.valorSelecionado}>
                    <Text style={selecionada ? styles.tituloSelecionado : styles.placeholder}>
                        {selecionada?.titulo ?? placeholder}
                    </Text>
                    {selecionada?.descricao && (
                        <Text style={styles.descricaoSelecionada}>{selecionada.descricao}</Text>
                    )}
                </View>
                <Ionicons
                    name={aberto ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={cores.textoSuave}
                />
            </Pressable>

            {aberto && (
                <View style={styles.listaSuspensa}>
                    <View style={styles.busca}>
                        <Ionicons name='search-outline' size={19} color={cores.textoSuave} />
                        <TextInput
                            style={styles.inputBusca}
                            placeholder={placeholderBusca}
                            placeholderTextColor={cores.placeholder}
                            value={busca}
                            onChangeText={setBusca}
                            autoFocus
                        />
                    </View>

                    {opcoesVisiveis.length === 0 ? (
                        <Text style={styles.semResultado}>Nenhum resultado encontrado</Text>
                    ) : (
                        <ScrollView
                            style={styles.resultados}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps='handled'
                        >
                            {opcoesVisiveis.map((opcao) => (
                                <Pressable
                                    key={opcao.id}
                                    style={[
                                        styles.opcao,
                                        selecionadoId === opcao.id && styles.opcaoSelecionada,
                                    ]}
                                    onPress={() => selecionar(opcao.id)}
                                >
                                    <View style={styles.textosOpcao}>
                                        <Text style={styles.tituloOpcao}>{opcao.titulo}</Text>
                                        {opcao.descricao && (
                                            <Text style={styles.descricaoOpcao}>{opcao.descricao}</Text>
                                        )}
                                    </View>
                                    {selecionadoId === opcao.id && (
                                        <Ionicons name='checkmark-circle' size={20} color={cores.laranja} />
                                    )}
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}

                    {opcoesFiltradas.length > opcoesVisiveis.length && (
                        <Text style={styles.limiteResultados}>
                            Mostrando 30 de {opcoesFiltradas.length}. Digite mais para refinar.
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },

    campo: {
        minHeight: 54,
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    campoAberto: {
        borderColor: cores.laranja,
    },

    valorSelecionado: {
        flex: 1,
        paddingRight: 10,
    },

    tituloSelecionado: {
        color: cores.azul,
        fontSize: 15,
        fontWeight: 'bold',
    },

    descricaoSelecionada: {
        color: cores.textoSuave,
        fontSize: 12,
        marginTop: 2,
    },

    placeholder: {
        color: cores.placeholder,
        fontSize: 15,
    },

    listaSuspensa: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 10,
        padding: 9,
        marginTop: 6,
    },

    busca: {
        minHeight: 44,
        backgroundColor: '#FFFBF6',
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    inputBusca: {
        flex: 1,
        color: cores.texto,
        fontSize: 14,
    },

    resultados: {
        maxHeight: 230,
        marginTop: 6,
    },

    opcao: {
        minHeight: 48,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    opcaoSelecionada: {
        backgroundColor: '#FFF0E8',
    },

    textosOpcao: {
        flex: 1,
        paddingRight: 8,
    },

    tituloOpcao: {
        color: cores.azul,
        fontSize: 14,
        fontWeight: 'bold',
    },

    descricaoOpcao: {
        color: cores.textoSuave,
        fontSize: 12,
        marginTop: 2,
    },

    semResultado: {
        color: cores.textoSuave,
        textAlign: 'center',
        padding: 18,
    },

    limiteResultados: {
        color: cores.textoSuave,
        fontSize: 11,
        textAlign: 'center',
        marginTop: 7,
    },
});
