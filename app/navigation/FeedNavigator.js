import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FEED_ROUTES } from "./routes";
import colors from "../config/colors";
import { ListingDetailsScreen, ListingsScreen } from "../screens";

const Stack = createNativeStackNavigator();

function FeedNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.light,
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
            backgroundColor: colors.white,
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default FeedNavigator;
