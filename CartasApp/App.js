import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CartaListScreen from "./src/screens/CartaListScreen";
import CartaFormScreen from "./src/screens/CartaFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="CartaList"
                screenOptions={{
                    headerStyle: { backgroundColor: "#1A237E" },
                    headerTintColor: "#FFF",
                    headerTitleStyle: { fontWeight: "600" },
                }}
            >
                <Stack.Screen
                    name="CartaList"
                    component={CartaListScreen}
                    options={{ title: "Gerenciamento de Cartas" }}
                />
                <Stack.Screen
                    name="CartaForm"
                    component={CartaFormScreen}
                    options={{ title: "Gerenciamento de Cartas" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
