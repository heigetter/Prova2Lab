import React, { useState } from "react";
import {
    View,
    StatusBar,
    Text,
    TextInput,
    StyleSheet,
    Pressable, ScrollView,
} from "react-native";
import { api } from "../service/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectList } from "react-native-dropdown-select-list"

export default function CartaFormScreen({ route, navigation }) {
    const { mode, carta, onSuccess } = route.params || {};
    const [selected, setSelected] = useState("");
    const [nome, setNome] = useState(carta?.nome || "");
    const [franquia, setFranquia] = useState(carta?.franquia || "");
    const [idioma, setidioma] = useState(carta?.idioma || "");
    const [edicao, setEdicao] = useState(carta?.edicao|| "");
    const [numeroC, setnumeroC] = useState(carta?.numeroC|| "");
    const [quantidade, setQuantidade] = useState(
        carta?.quantidade != null ? String(carta.quantidade) : ""
    );
    const [preco, setPreco] = useState(
        carta?.preco != null ? String(carta.preco) : ""
    );
    const [fornecedor, setFornecedor] = useState(carta?.fornecedor || "");
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const listaFranq = [
        {key:"1", value:"Yu-Gi-Oh!"},
        {key:"2", value:"Magic"},
        {key:"3", value:"Pokémon"},
        {key:"4", value:"Digimon"},
        {key:"5", value:"Outro"},
    ]

    const listaIdioma = [
        {key:"PT", value:"Português"},
        {key:"EN", value:"Inglês"},
        {key:"SP", value:"Espanhol"},
        {key:"FR", value:"Francês"},
        {key:"DU", value:"Alemão"},
    ]

    async function handleSave() {
        const quantidadeNumber = quantidade.trim() === "" ? null : Number(quantidade);
        const precoNumber = preco.trim() === "" ? null : Number(preco);

        const payload = {
            nome: nome.trim(),
            franquia: franquia.trim(),
            idioma: idioma.trim(),
            edicao: edicao.trim(),
            numeroC: numeroC.trim(),
            quantidade: quantidadeNumber,
            preco: precoNumber,
            fornecedor: fornecedor.trim(),
        };

        try {
            setSaving(true);

            if (mode === "edit" && carta?.id) {
                await api.put(`/cartas/${carta.id}`, payload);
                onSuccess?.("Carta atualizada com sucesso!");
            } else {
                await api.post("/cartas", payload);
                onSuccess?.("Carta cadastrada com sucesso!");
            }

            navigation.goBack();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Não foi possível salvar a carta." });
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
            <ScrollView style={styles.container}>
                <StatusBar style={styles.statusBar} />
                <Text style={styles.title}>
                    {mode === "edit" ? "Editar Carta" : "Novo Carta"}
                </Text>
                {errors.general && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{errors.general}</Text>
                    </View>
                )}
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={(text) => {
                        setNome(text);
                        setErrors((prev) => ({ ...prev, nome: null }));
                    }}
                    placeholder="Nome da carta"
                    maxLength={150}
                />
                {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

                <Text style={styles.label}>Franquia</Text>
                <SelectList
                    setSelected={(val) => {setFranquia(val)
                        setErrors((prev) => ({...prev, franquia: null}))}}
                    data={listaFranq}
                    save="value"
                    placeholder="Qual franquia?"
                />
                {errors.franquia && <Text style={styles.errorText}>{errors.franquia}</Text>}

                <Text style={styles.label}>Idioma</Text>
                <SelectList
                    setSelected={(val) => {setidioma(val)
                        setErrors((prev) => ({...prev, idioma: null}))}
                }
                    data={listaIdioma}
                    save="value"
                    placeholder="Qual idioma?"
                />
                {errors.idioma && <Text style={styles.errorText}>{errors.idioma}</Text>}

                <Text style={styles.label}>Edição da Carta</Text>
                <TextInput
                    style={styles.input}
                    value={edicao}
                    onChangeText={(text) => {
                        setEdicao(text);
                        setErrors((prev) => ({ ...prev, edicao: null }));
                    }}
                    placeholder="Edição da carta"
                    maxLength={150}
                />
                {errors.edicao && <Text style={styles.errorText}>{errors.edicao}</Text>}

                <Text style={styles.label}>Número da Carta</Text>
                <TextInput
                    style={styles.input}
                    value={numeroC}
                    onChangeText={(text) => {
                        setnumeroC(text);
                        setErrors((prev) => ({ ...prev, numeroC: null }));
                    }}
                    placeholder="Número da carta"
                    maxLength={50}
                />
                {errors.numeroC && <Text style={styles.errorText}>{errors.numeroC}</Text>}

                <Text style={styles.label}>Preço</Text>
                <TextInput
                    style={styles.input}
                    value={preco}
                    onChangeText={(text) => {
                        const validade = text.match(/^(\d*\.{0,1}\d{0,2}$)/)
                        if (validade){
                            setPreco(text);
                            setErrors((prev) => ({ ...prev, preco: null }));
                        }
                    }}
                    placeholder="Preço da cartas"
                    keyboardType="numeric"
                />
                {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}

                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                    style={styles.input}
                    value={quantidade}
                    onChangeText={(text) => {
                        setQuantidade(text);
                        setErrors((prev) => ({ ...prev, quantidade: null }));
                    }}
                    placeholder="Quantidade de cartas"
                    keyboardType="numeric"
                />
                {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade}</Text>}

                <Text style={styles.label}>Fornecedor</Text>
                <TextInput
                    style={styles.input}
                    value={fornecedor}
                    onChangeText={(text) => {
                        setFornecedor(text);
                        setErrors((prev) => ({ ...prev, fornecedor: null }));
                    }}
                    placeholder="Vendedor da carta"
                    maxLength={100}
                />
                {errors.fornecedor && <Text style={styles.errorText}>{errors.fornecedor}</Text>}

                <Pressable
                    style={[styles.button, saving && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <Text style={styles.buttonText}>
                        {saving ? "Salvando..." : "Salvar"}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#F3F4F6",
    },
    statusBar: {
        barStyle: "light-content",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginTop: 12,
    },
    errorBanner: {
        backgroundColor: "#FEE2E2",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },
    errorBannerText: {
        color: "#B91C1C",
        fontSize: 14,
        fontWeight: "500",
    },
    errorText: {
        color: "#B91C1C",
        fontSize: 12,
        marginTop: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    button: {
        marginTop: 24,
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 16,
    },
});
