import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Produto } from '../models/Produto';
import { cores } from '../theme/tema';
import { formatarMoeda } from '../utils/formatacao';
import { iconeDoProduto } from '../utils/icones';

type CardProdutoVendaProps = {
    produto: Produto,
    quantidade: number,
    onAlterarQuantidade: (id: number, quantidade: number) => void
}

export default function CardProdutoVenda({
    produto,
    quantidade,
    onAlterarQuantidade
}: CardProdutoVendaProps) {

    return (
        <View style={[styles.card, quantidade > 0 && styles.cardSelecionado]}>
            <View style={styles.iconeProduto}>
                <Ionicons
                    name={iconeDoProduto(produto)}
                    size={22}
                    color={cores.azul}
                />
            </View>

            <View style={styles.informacoes}>
                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.descricao} numberOfLines={1}>
                    {produto.descricao}
                </Text>
                <View style={styles.linhaPreco}>
                    <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
                    <Text style={styles.estoque}>{produto.estoque} disponíveis</Text>
                </View>
            </View>

            <View style={styles.controle}>
                <Pressable
                    style={styles.botaoQuantidade}
                    onPress={() => onAlterarQuantidade(produto.id, quantidade - 1)}
                    disabled={quantidade === 0}
                >
                    <Text style={styles.simbolo}>−</Text>
                </Pressable>

                <Text style={styles.quantidade}>{quantidade}</Text>

                <Pressable
                    style={styles.botaoQuantidade}
                    onPress={() => onAlterarQuantidade(produto.id, quantidade + 1)}
                    disabled={quantidade >= produto.estoque}
                >
                    <Text style={styles.simbolo}>+</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 13,
        marginBottom: 9,
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardSelecionado: {
        borderColor: cores.laranja,
    },

    iconeProduto: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    informacoes: {
        flex: 1,
        paddingRight: 10,
    },

    nome: {
        color: cores.texto,
        fontSize: 16,
        fontWeight: 'bold',
    },

    descricao: {
        color: cores.textoSuave,
        fontSize: 12,
        marginTop: 2,
    },

    linhaPreco: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },

    preco: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
    },

    estoque: {
        color: cores.textoSuave,
        fontSize: 11,
    },

    controle: {
        minWidth: 112,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0E8DF',
        borderRadius: 10,
        padding: 4,
    },

    botaoQuantidade: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: cores.card,
        alignItems: 'center',
        justifyContent: 'center',
    },

    simbolo: {
        color: cores.azul,
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 24,
    },

    quantidade: {
        color: cores.azul,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
