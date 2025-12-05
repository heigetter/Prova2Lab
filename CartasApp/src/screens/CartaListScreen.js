import { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    StatusBar,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Alert,
    RefreshControl, TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../service/api";
import CartaItem from "../components/CartaItem";

export default function CartaListScreen({ navigation }) {
    const [cartas, setCartas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const timeoutRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    function showSuccess(message) {
        setSuccessMessage(message);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setSuccessMessage("");
        }, 5000);
    }

    async function carregarCartas(showLoading = true) {
        try {
            if (showLoading) setLoading(true);
            const response = await api.get("/cartas");
            setCartas(response.data);
        } catch (error) {
            console.error("Erro ao carregar cartas:", error);
            Alert.alert("Erro", "Não foi possível carregar as cartas.");
            setCartas([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            carregarCartas(true);
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        carregarCartas(false);
    };

    function handleAdd() {
        navigation.navigate("CartaForm", {
            mode: "create",
            onSuccess: (msg) => showSuccess(msg),
        });
    }

    function handleEdit(carta) {
        navigation.navigate("CartaForm", {
            mode: "edit",
            carta,
            onSuccess: (msg) => showSuccess(msg),
        });
    }

    async function deletarCarta(carta) {
        try {
            await api.delete(`/cartas/${carta.id}`);
            setCartas((prev) => prev.filter((c) => c.id !== carta.id));
            showSuccess("Carta excluída com sucesso!");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a carta.");
        }
    }
    async function acharNome(showLoading = true, term = searchTerm){
        try{
            if (showLoading) setLoading(true);

            let url = "/cartas";

            if(term && term.trim() !== '') {
                url = `/cartas/acharNome?nome=${encodeURIComponent(term)}`;
            }

            const response = await api.get(url);

            if (response.data && Array.isArray(response.data)) {
                setCartas(response.data);
            } else {
                setCartas([]);
            }
        } catch(error) {
            Alert.alert("Erro","Não foi possível carregar as cartas.");
            setCartas([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }



    }
    async function handleDelete(carta) {
        Alert.alert(
            "Confirmar exclusão",
            `Deseja realmente excluir a carta "${carta.nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        deletarCarta(carta);
                    },
                },
            ]
        );
    }

    function renderItem({ item }) {
        return (
            <CartaItem
                carta={item}
                onPress={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
            <View style={styles.container}>
                <StatusBar style={styles.statusBar}/>
                <View style={styles.header}>
                    <TextInput placeholder={"Pesquisar por Nome"}
                               value={searchTerm}
                               onChangeText={setSearchTerm}
                               onSubmitEditing={() => acharNome(true, searchTerm)}/>
                </View>
                <View style={styles.header}>
                    <Text style={styles.title}>Lista de Cartas</Text>
                    <Pressable style={styles.addButton} onPress={handleAdd}>
                        <Text style={styles.addButtonText}>Novo</Text>
                    </Pressable>
                </View>

                {successMessage ? (
                    <View style={styles.successBanner}>
                        <Text style={styles.successBannerText}>{successMessage}</Text>
                    </View>
                ) : null}

                {loading ? (
                    <ActivityIndicator size="large" style={styles.loading} />
                ) : (
                    <FlatList
                        data={cartas}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={
                            cartas.length === 0 && styles.emptyListContainer
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Nenhuma carta cadastrada.</Text>
                        }
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 12,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#F3F4F6",
    },
    statusBar: {
        barStyle: "light-content",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    successBanner: {
        backgroundColor: "#D1FAE5",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#6EE7B7",
    },
    successBannerText: {
        color: "#065F46",
        fontSize: 14,
        fontWeight: "500",
    },
    addButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: "#FFF",
        fontWeight: "600",
    },
    loading: {
        marginTop: 32,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#6B7280",
    },
});
