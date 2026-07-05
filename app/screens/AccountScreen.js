import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "../api/auth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import Icon from "../components/Icon";
import ListItem from "../components/ListItem";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import ListItemSeparator from "../components/ListItemSeparator";
import colors from "../config/colors";
import { ROOT_ROUTES, TAB_ROUTES } from "../navigation/routes";

const menuItems = [
  {
    id: 1,
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    id: 2,
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
  },
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
                  backgroundColor={item.icon.backgroundColor}
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
          IconComponent={
            <Icon name="logout" backgroundColor={colors.danger} />
          }
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  profileContainer: {
    marginVertical: 20,
  },
  menuContainer: {
    marginBottom: 20,
  },
  logoutContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 28,
  },
  emptyText: {
    color: colors.medium,
    marginTop: 4,
    textAlign: "center",
  },
  emptyTitle: {
    color: colors.black,
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
    color: colors.medium,
    marginTop: 2,
  },
  messagesTitle: {
    color: colors.black,
    fontSize: 22,
    fontWeight: "700",
  },
});

export default AccountScreen;
