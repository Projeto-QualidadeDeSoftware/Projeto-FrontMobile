import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../theme/tema';

type BotaoProps = {
    titulo: string,
    onPress: () => void,
    variante?: 'principal' | 'secundario' | 'perigo',
    desabilitado?: boolean
}

export default function Botao({
    titulo,
    onPress,
    variante = 'principal',
    desabilitado = false
}: BotaoProps) {

    return (
        <Pressable
            style={[
                styles.botao,
                variante === 'secundario' && styles.secundario,
                variante === 'perigo' && styles.perigo,
                desabilitado && styles.desabilitado,
            ]}
            onPress={onPress}
            disabled={desabilitado}
        >
            <Text
                style={[
                    styles.texto,
                    variante === 'secundario' && styles.textoSecundario,
                    variante === 'perigo' && styles.textoPerigo,
                ]}
            >
                {titulo}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    botao: {
        minHeight: 46,
        backgroundColor: cores.laranja,
        borderRadius: 10,
        paddingVertical: 13,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    secundario: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
    },

    perigo: {
        backgroundColor: cores.perigoClaro,
        borderWidth: 1,
        borderColor: cores.perigo,
    },

    desabilitado: {
        opacity: 0.45,
    },

    texto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    textoSecundario: {
        color: cores.azul,
    },

    textoPerigo: {
        color: cores.perigo,
    },
});
