import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import FeedNavigator from "./FeedNavigator";
import { TAB_ROUTES } from "./routes";
import colors from "../config/colors";
import { AccountScreen, ListingEditScreen } from "../screens";

const Tab = createBottomTabNavigator();

const tabs = {
  [TAB_ROUTES.FEED]: {
    icon: "storefront-outline",
    label: "Browse",
  },
  [TAB_ROUTES.SELL]: {
    icon: "plus",
    label: "Sell",
  },
  [TAB_ROUTES.ACCOUNT]: {
    icon: "account-circle-outline",
    label: "Account",
  },
};

function TabBarButton({ accessibilityState, children, onPress, routeName }) {
  const focused = accessibilityState?.selected;
  const isSellTab = routeName === TAB_ROUTES.SELL;
  const tab = tabs[routeName];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        isSellTab && styles.sellButtonSlot,
        pressed && styles.pressed,
      ]}
    >
      {isSellTab ? (
        <View style={[styles.sellButton, focused && styles.sellButtonFocused]}>
          <MaterialCommunityIcons
            name={tab.icon}
            color={colors.white}
            size={28}
          />
        </View>
      ) : (
        <View style={[styles.tabPill, focused && styles.tabPillFocused]}>
          {children}
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {tab.label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.medium,
        tabBarButton: (props) => (
          <TabBarButton {...props} routeName={route.name} />
        ),
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          borderRadius: 28,
          bottom: 18,
          elevation: 12,
          height: 72,
          left: 18,
          paddingHorizontal: 8,
          paddingTop: 10,
          position: "absolute",
          right: 18,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.14,
          shadowRadius: 20,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <MaterialCommunityIcons
            name={tabs[route.name].icon}
            color={focused ? colors.primary : color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen
        name={TAB_ROUTES.FEED}
        component={FeedNavigator}
        options={{ headerShown: false, title: "Browse" }}
      />
      <Tab.Screen
        name={TAB_ROUTES.SELL}
        component={ListingEditScreen}
        options={{ title: "Sell" }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ACCOUNT}
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.78,
  },
  sellButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  sellButtonFocused: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  sellButtonSlot: {
    top: -22,
  },
  tabBarItem: {
    height: 56,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    color: colors.medium,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  tabLabelFocused: {
    color: colors.primary,
  },
  tabPill: {
    minWidth: 86,
    minHeight: 50,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillFocused: {
    backgroundColor: "#fff1f2",
  },
});

export default AppNavigator;
