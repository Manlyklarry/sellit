import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import createNavigationTheme from "./navigationTheme";
import { ROOT_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import { getCurrentUser } from "../auth/session";
import AppActivityIndicator from "../components/AppActivityIndicator";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { theme } = useAppTheme();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((user) => {
      if (mounted) setInitialRoute(user ? ROOT_ROUTES.APP : ROOT_ROUTES.AUTH);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!initialRoute) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <AppActivityIndicator message="Opening Sellit..." />
      </View>
    );
  }

  return (
    <NavigationContainer theme={createNavigationTheme(theme)}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
        <Stack.Screen name={ROOT_ROUTES.APP} component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootNavigator;
