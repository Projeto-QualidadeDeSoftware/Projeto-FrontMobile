import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import CardResumo from '../components/CardResumo';
import { cores } from '../theme/tema';

type InicioProps = {
    quantidadeProdutos: number,
    quantidadeClientes: number,
    quantidadeVendas: number,
    onAbrirVendas: () => void
}

export default function Inicio({
    quantidadeProdutos,
    quantidadeClientes,
    quantidadeVendas,
    onAbrirVendas
}: InicioProps) {

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.marca}>PRONTÊ</Text>
            <Text style={styles.subtitulo}>Gestão rápida para sua loja</Text>

            <Text style={styles.tituloSecao}>Resumo</Text>

            <View style={styles.resumos}>
                <CardResumo valor={quantidadeProdutos} titulo='Produtos' icone='cube-outline' />
                <CardResumo valor={quantidadeClientes} titulo='Clientes' icone='people-outline' />
                <CardResumo valor={quantidadeVendas} titulo='Vendas' icone='receipt-outline' />
            </View>

            <View style={styles.destaque}>
                <Text style={styles.tituloDestaque}>Frente de caixa</Text>
                <Text style={styles.textoDestaque}>
                    Selecione os produtos, escolha o cliente e registre uma venda.
                </Text>

                <Botao titulo='Iniciar nova venda' onPress={onAbrirVendas} />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 52,
        paddingBottom: 30,
    },

    marca: {
        color: cores.azul,
        fontSize: 32,
        fontWeight: 'bold',
    },

    subtitulo: {
        color: cores.textoSuave,
        fontSize: 16,
        marginTop: 3,
    },

    tituloSecao: {
        color: cores.azul,
        fontSize: 21,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 11,
    },

    resumos: {
        flexDirection: 'row',
        gap: 10,
    },

    destaque: {
        backgroundColor: cores.azul,
        borderRadius: 14,
        padding: 18,
        marginTop: 18,
    },

    tituloDestaque: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },

    textoDestaque: {
        color: '#D5DBE8',
        fontSize: 15,
        lineHeight: 21,
        marginTop: 6,
        marginBottom: 14,
    },

});
