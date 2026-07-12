import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AUTH_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import {
  HowItWorksScreen,
  LoginScreen,
  OnboardingSuccessScreen,
  RegisterScreen,
  SellingTypeScreen,
  WelcomeScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        contentStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerTintColor: theme.foreground,
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name={AUTH_ROUTES.WELCOME}
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.HOW_IT_WORKS}
        component={HowItWorksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.SELLING_TYPE}
        component={SellingTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.REGISTER}
        component={RegisterScreen}
        options={{ title: "Create account" }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.ONBOARDING_SUCCESS}
        component={OnboardingSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
