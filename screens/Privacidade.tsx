import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/tema';

type PrivacidadeProps = {
    onVoltar: () => void
}

export default function Privacidade({ onVoltar }: PrivacidadeProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Pressable style={styles.voltar} onPress={onVoltar}>
                <Ionicons name='arrow-back' size={20} color={cores.azul} />
                <Text style={styles.textoVoltar}>Configurações</Text>
            </Pressable>

            <Text style={styles.titulo}>Privacidade e dados</Text>
            <Text style={styles.subtitulo}>Como as informações são utilizadas no Prontê</Text>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Finalidade</Text>
                <Text style={styles.texto}>
                    O Prontê utiliza os dados cadastrados para autenticar funcionários e permitir
                    a gestão de clientes, produtos, estoque e vendas da organização responsável.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Dados tratados</Text>
                <Text style={styles.texto}>
                    O sistema pode armazenar nome, CPF, telefone e e-mail de clientes; nome, CPF,
                    cargo, salário e credenciais de funcionários; além de produtos, estoque e
                    registros de vendas.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Armazenamento e segurança</Text>
                <Text style={styles.texto}>
                    As informações são enviadas por conexão HTTPS para a API do Prontê e ficam
                    armazenadas no banco de dados administrado pela organização. O acesso às
                    funcionalidades protegidas exige autenticação.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Assistente de estoque</Text>
                <Text style={styles.texto}>
                    Quando o assistente é utilizado, a pergunta e informações necessárias sobre
                    o estoque podem ser processadas pelo serviço de inteligência artificial
                    configurado pela API.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Correção ou exclusão</Text>
                <Text style={styles.texto}>
                    Solicitações relacionadas à correção ou exclusão de dados devem ser feitas ao
                    administrador responsável pelo Prontê na organização. Registros vinculados a
                    vendas podem precisar ser preservados conforme regras administrativas ou legais.
                </Text>
            </View>

            <Text style={styles.observacao}>
                Esta versão não utiliza publicidade nem vende informações cadastradas no sistema.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 46,
        paddingBottom: 36,
    },

    voltar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        marginBottom: 13,
    },

    textoVoltar: {
        color: cores.azul,
        fontSize: 14,
        fontWeight: 'bold',
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
        marginBottom: 18,
    },

    card: {
        backgroundColor: cores.card,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 13,
        padding: 16,
        marginBottom: 11,
    },

    tituloCard: {
        color: cores.azul,
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 7,
    },

    texto: {
        color: cores.textoSuave,
        fontSize: 14,
        lineHeight: 21,
    },

    observacao: {
        color: cores.textoSuave,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
        textAlign: 'center',
    },
});
