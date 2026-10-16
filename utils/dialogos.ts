import { Alert, Platform } from 'react-native';

export function avisar(titulo: string, mensagem: string) {
    if (Platform.OS === 'web') {
        globalThis.alert(`${titulo}\n\n${mensagem}`);
        return;
    }

    Alert.alert(titulo, mensagem);
}

export function confirmar(
    titulo: string,
    mensagem: string,
    onConfirmar: () => void | Promise<void>
) {
    if (Platform.OS === 'web') {
        if (globalThis.confirm(`${titulo}\n\n${mensagem}`)) {
            void onConfirmar();
        }
        return;
    }

    Alert.alert(
        titulo,
        mensagem,
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: onConfirmar },
        ]
    );
}
