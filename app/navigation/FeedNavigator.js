import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FEED_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import { ListingDetailsScreen, ListingsScreen } from "../screens";

const Stack = createNativeStackNavigator();

function FeedNavigator() {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerTintColor: theme.foreground,
        headerStyle: {
          backgroundColor: theme.background,
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
          headerStyle: {
            backgroundColor: theme.card,
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default FeedNavigator;
