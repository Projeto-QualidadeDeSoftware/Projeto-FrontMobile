import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/tema';
import { NomeIcone } from '../utils/icones';

type CardResumoProps = {
    valor: number,
    titulo: string,
    icone: NomeIcone
}

export default function CardResumo({ valor, titulo, icone }: CardResumoProps) {
    return (
        <View style={styles.card}>
            <View style={styles.icone}>
                <Ionicons name={icone} size={19} color={cores.laranja} />
            </View>
            <Text style={styles.valor}>{valor}</Text>
            <Text style={styles.titulo}>{titulo}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 92,
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 14,
    },

    icone: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#FFF0E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    valor: {
        color: cores.azul,
        fontSize: 27,
        fontWeight: 'bold',
    },

    titulo: {
        color: cores.textoSuave,
        fontSize: 13,
        marginTop: 3,
    },
});
