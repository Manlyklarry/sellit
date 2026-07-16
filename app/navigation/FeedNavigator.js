import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FEED_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import { ListingDetailsScreen, ListingsScreen } from "../screens";
import LiquidGlassView from "../components/LiquidGlassView";

const Stack = createNativeStackNavigator();

function FeedNavigator() {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerBackTitle: "Back",
        headerBackground: () => (
          <LiquidGlassView
            fallbackColor={theme.background}
            style={{ flex: 1 }}
            tintColor={theme.background}
          />
        ),
        headerShadowVisible: false,
        headerTintColor: theme.foreground,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          fontWeight: "800",
        },
      }}
    >
      <Stack.Screen
        name={FEED_ROUTES.LISTINGS}
        component={ListingsScreen}
        options={{ headerShown: false, title: "Browse" }}
      />
      <Stack.Screen
        name={FEED_ROUTES.DETAILS}
        component={ListingDetailsScreen}
        options={({ route }) => ({
          title: route.params?.listing?.title || "Listing",
          headerBackground: () => (
            <LiquidGlassView
              fallbackColor={theme.card}
              style={{ flex: 1 }}
              tintColor={theme.card}
            />
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default FeedNavigator;
