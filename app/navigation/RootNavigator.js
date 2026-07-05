import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import navigationTheme from "./navigationTheme";
import { ROOT_ROUTES } from "./routes";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
        <Stack.Screen name={ROOT_ROUTES.APP} component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
