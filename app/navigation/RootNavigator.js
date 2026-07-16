import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import createNavigationTheme from "./navigationTheme";
import { ROOT_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import { clearCurrentUser } from "../auth/session";
import { subscribeToAuthenticationState } from "../auth/authEvents";
import { verifyCurrentSession } from "../api/auth";
import AppActivityIndicator from "../components/AppActivityIndicator";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { theme } = useAppTheme();
  const navigationRef = useNavigationContainerRef();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToAuthenticationState((user) => {
      if (!mounted || user || !navigationRef.isReady()) return;
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: ROOT_ROUTES.AUTH }],
      });
    });

    verifyCurrentSession()
      .then((user) => {
        if (mounted) setInitialRoute(user ? ROOT_ROUTES.APP : ROOT_ROUTES.AUTH);
      })
      .catch(async () => {
        await clearCurrentUser();
        if (mounted) setInitialRoute(ROOT_ROUTES.AUTH);
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigationRef]);

  if (!initialRoute) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <AppActivityIndicator message="Opening Sellit..." />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={createNavigationTheme(theme)}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
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
