import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "../api/auth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import Icon from "../components/Icon";
import ListItem from "../components/ListItem";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import ListItemSeparator from "../components/ListItemSeparator";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";

const menuItems = [
  {
    id: 1,
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      colorKey: "primary",
    },
  },
  {
    id: 2,
    title: "My Messages",
    icon: {
      name: "email",
      colorKey: "secondary",
    },
  },
];

const accountStats = [
  { label: "Active", value: "5" },
  { label: "Unread", value: "2" },
  { label: "Rating", value: "4.9" },
];

const initialMessages = [
  {
    id: 1,
    title: "Kwame Mensah",
    subTitle:
      "Is the bicycle still available? I can come by this evening if that works for you.",
    time: "2m",
    unread: true,
    image: require("../assets/profiles/larry.jpeg"),
  },
  {
    id: 2,
    title: "Ama Boateng",
    subTitle: "Can you deliver the kente cloth today?",
    time: "1h",
    unread: true,
  },
  {
    id: 3,
    title: "Kofi Addo",
    subTitle: "I can pick up the charcoal stove this evening.",
    time: "Yesterday",
  },
];

function AccountScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    setMessages(messages.filter((item) => item.id !== message.id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setMessages(initialMessages);
    setTimeout(() => setRefreshing(false), 900);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("Logout failed", error.message);
    }

    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: ROOT_ROUTES.AUTH }],
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Profile</Text>
          <Text style={styles.heading}>Your account</Text>
        </View>
        <ThemeToggle />
      </View>

      <View style={styles.summaryPanel}>
        <View>
          <Text style={styles.summaryTitle}>MANLYKLARRY</Text>
          <Text style={styles.summaryText}>Local seller dashboard</Text>
        </View>
        <View style={styles.statsGrid}>
          {accountStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.profileContainer}>
        <ListItem
          title="MANLYKLARRY"
          subTitle="5 Listings"
          image={require("../assets/profiles/larry.jpeg")}
          showChevron
          onPress={() => console.log("profile")}
        />
      </View>

      <View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              showChevron
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={theme[item.icon.colorKey]}
                />
              }
              onPress={() => {
                if (item.title === "My Listings") {
                  navigation.navigate(TAB_ROUTES.FEED);
                  return;
                }

                console.log(item.title);
              }}
            />
          )}
        />
      </View>

      <View style={styles.logoutContainer}>
        <ListItem
          title="Logout"
          showChevron
          IconComponent={<Icon name="logout" backgroundColor={theme.danger} />}
          onPress={handleLogout}
        />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        ItemSeparatorComponent={ListItemSeparator}
        ListHeaderComponent={
          <>
            <View style={styles.messagesHeader}>
              <Text style={styles.messagesTitle}>Messages</Text>
              <Text style={styles.messagesMeta}>
                {messages.length} conversations
              </Text>
            </View>
            {refreshing ? (
              <AppActivityIndicator compact message="Refreshing messages..." />
            ) : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No messages</Text>
            <Text style={styles.emptyText}>
              Buyer conversations will appear here.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.subTitle}
            image={item.image}
            rightText={item.time}
            showBadge={item.unread}
            showChevron
            subTitleNumberOfLines={2}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
            onPress={() => console.log(item.title)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  profileContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 14,
    marginTop: 14,
    overflow: "hidden",
  },
  menuContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  logoutContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 28,
  },
  emptyText: {
    color: theme.muted,
    marginTop: 4,
    textAlign: "center",
  },
  emptyTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "700",
  },
  messagesHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  messagesList: {
    paddingBottom: 120,
  },
  messagesMeta: {
    color: theme.muted,
    marginTop: 2,
  },
  messagesTitle: {
    color: theme.foreground,
    fontSize: 22,
    fontWeight: "700",
  },
  eyebrow: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heading: {
    color: theme.foreground,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },
  statCard: {
    backgroundColor: theme.input,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  statLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statValue: {
    color: theme.foreground,
    fontSize: 20,
    fontWeight: "900",
  },
  summaryPanel: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: theme.mode === "dark" ? 0.2 : 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  summaryText: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },
  summaryTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
});

export default AccountScreen;
