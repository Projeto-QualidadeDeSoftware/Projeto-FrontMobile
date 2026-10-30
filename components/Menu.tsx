import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores } from '../theme/tema';

export type Tela = 'inicio' | 'vendas' | 'produtos' | 'mais' | 'configuracoes' | 'privacidade' | 'clientes' | 'funcionarios';

type MenuProps = {
    telaAtual: Tela,
    onMudarTela: (tela: Tela) => void
}

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

const opcoes: {
    tela: 'inicio' | 'vendas' | 'produtos' | 'mais' | 'configuracoes',
    titulo: string,
    icone: NomeIcone,
    iconeSelecionado: NomeIcone
}[] = [
    { tela: 'inicio', titulo: 'Início', icone: 'home-outline', iconeSelecionado: 'home' },
    { tela: 'vendas', titulo: 'Vendas', icone: 'cart-outline', iconeSelecionado: 'cart' },
    { tela: 'produtos', titulo: 'Produtos', icone: 'cube-outline', iconeSelecionado: 'cube' },
    { tela: 'mais', titulo: 'Mais', icone: 'grid-outline', iconeSelecionado: 'grid' },
    { tela: 'configuracoes', titulo: 'Ajustes', icone: 'settings-outline', iconeSelecionado: 'settings' },
];

export default function Menu({ telaAtual, onMudarTela }: MenuProps) {
    const areaSegura = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.menu,
                { paddingBottom: Math.max(12, areaSegura.bottom) },
            ]}
        >
            {
                opcoes.map((opcao) => {
                    const selecionada = telaAtual === opcao.tela || (
                        opcao.tela === 'mais' &&
                        (telaAtual === 'clientes' || telaAtual === 'funcionarios')
                    ) || (
                        opcao.tela === 'configuracoes' && telaAtual === 'privacidade'
                    );

                    return (
                        <Pressable
                            key={opcao.tela}
                            style={styles.opcao}
                            onPress={() => onMudarTela(opcao.tela)}
                        >
                            <View
                                style={[
                                    styles.marcador,
                                    selecionada && styles.marcadorSelecionado,
                                ]}
                            />
                            <Ionicons
                                name={
                                    selecionada
                                        ? opcao.iconeSelecionado
                                        : opcao.icone
                                }
                                size={23}
                                color={selecionada ? cores.laranja : '#D5DBE8'}
                                style={styles.icone}
                            />
                            <Text
                                style={[
                                    styles.texto,
                                    selecionada && styles.textoSelecionado,
                                ]}
                            >
                                {opcao.titulo}
                            </Text>
                        </Pressable>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        minHeight: 84,
        backgroundColor: cores.azul,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 12,
    },

    opcao: {
        flex: 1,
        minHeight: 62,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },

    marcador: {
        width: 24,
        height: 4,
        borderRadius: 4,
        backgroundColor: 'transparent',
        marginBottom: 4,
    },

    marcadorSelecionado: {
        backgroundColor: cores.laranja,
    },

    icone: {
        marginBottom: 3,
    },

    texto: {
        color: '#D5DBE8',
        fontSize: 12,
        fontWeight: '600',
    },

    textoSelecionado: {
        color: cores.laranja,
    },
});
