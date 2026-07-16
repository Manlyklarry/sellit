import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import FeedNavigator from "./FeedNavigator";
import { TAB_ROUTES } from "./routes";
import { useAppTheme } from "../config/theme";
import { AccountScreen, ListingEditScreen } from "../screens";
import LiquidGlassView from "../components/LiquidGlassView";

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
  const { theme } = useAppTheme();
  const focused = accessibilityState?.selected;
  const isSellTab = routeName === TAB_ROUTES.SELL;
  const tab = tabs[routeName];
  const styles = createStyles(theme);

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
        <LiquidGlassView
          fallbackColor={focused ? theme.secondary : theme.primary}
          isInteractive
          style={[
            styles.sellButton,
            { shadowColor: focused ? theme.secondary : theme.primary },
          ]}
          tintColor={focused ? theme.secondary : theme.primary}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            color="#ffffff"
            size={28}
          />
        </LiquidGlassView>
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
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarButton: (props) => (
          <TabBarButton {...props} routeName={route.name} />
        ),
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: () => null,
        tabBarBackground: () => (
          <LiquidGlassView
            fallbackColor={theme.tab}
            style={styles.tabBarBackground}
            tintColor={theme.tab}
          />
        ),
        tabBarStyle: {
          backgroundColor: "transparent",
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
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.14,
          shadowRadius: 20,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <MaterialCommunityIcons
            name={tabs[route.name].icon}
            color={focused ? theme.primary : color}
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

const createStyles = (theme) =>
  StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  sellButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  sellButtonSlot: {
    top: -22,
  },
  tabBarItem: {
    height: 56,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  tabLabelFocused: {
    color: theme.primary,
  },
  tabPill: {
    minWidth: 86,
    minHeight: 50,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillFocused: {
    backgroundColor: theme.primarySoft,
  },
});

export default AppNavigator;
