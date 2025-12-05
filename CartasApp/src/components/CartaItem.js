import { View, Text, StyleSheet, Pressable } from "react-native";
import {useState} from "react";

export default function CartaItem({ carta, onPress, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = () => {setIsExpanded(!isExpanded);}
    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemNome}>{carta.nome}</Text>

                <View style={styles.buttonsContainer}>
                    <Pressable onPress={onPress} style={styles.editButton}>
                        <Text style={styles.editText}>Editar</Text>
                    </Pressable>
                    <Pressable onPress={onDelete} style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Excluir</Text>
                    </Pressable>
                </View>
            </View>


            <Pressable onPress={handlePress}>
                <Text style={styles.itemEmail}>{carta.franquia}</Text>
                {isExpanded && (
                    <View>
                        {carta.edicao && (
                        <Text style={styles.itemIdade}>Edição: {carta.edicao} </Text>
                        )}
                        {carta.idioma && (
                            <Text style={styles.itemIdade}>Idioma: {carta.idioma} </Text>
                        )}
                        {carta.numeroC && (
                            <Text style={styles.itemIdade}>Número da Carta: {carta.numeroC} </Text>
                        )}
                        {carta.preco && (
                            <Text style={styles.itemIdade}>Preço: {Intl.NumberFormat('pt-BR',{
                                style: 'currency',
                                currency: 'BRL'
                            }).format(carta.preco)} </Text>
                        )}
                        {carta.quantidade && (
                            <Text style={styles.itemIdade}>{carta.quantidade} Unidades</Text>
                        )}
                        {carta.fornecedor && (
                            <Text style={styles.itemIdade}>Vendendor: {carta.fornecedor}</Text>
                        )}
                    </View>

                )}

            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between", // nome à esquerda, grupo de botões à direita
        alignItems: "center",
    },
    itemNome: {
        fontSize: 18,
        fontWeight: "600",
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    itemEmail: {
        color: "#4B5563",
        fontWeight: "bold",
        fontSize: 15,
        marginTop: 4,
    },
    itemIdade: {
        color: "#6B7280",
        marginTop: 2,
    },
    editButton: {
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    deleteButton: {
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    editText: {
        color: "#2563EB",
        fontWeight: "500",
    },
    deleteText: {
        color: "#DC2626",
        fontWeight: "500",
    },
});
