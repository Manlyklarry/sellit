import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "../components/Icon";
import ListItem from "../components/ListItem";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import ListItemSeparator from "../components/ListItemSeparator";
import colors from "../config/colors";

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
    subTitle: "Is the bicycle still available?",
    image: require("../assets/profiles/larry.jpeg"),
  },
  {
    id: 2,
    title: "Ama Boateng",
    subTitle: "Can you deliver the kente cloth today?",
  },
  {
    id: 3,
    title: "Kofi Addo",
    subTitle: "I can pick up the charcoal stove this evening.",
  },
];

function AccountScreen() {
  const [messages, setMessages] = useState(initialMessages);

  const handleDelete = (message) => {
    setMessages(messages.filter((item) => item.id !== message.id));
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.profileContainer}>
        <ListItem
          title="MANLYKLARRY"
          subTitle="5 Listings"
          image={require("../assets/profiles/larry.jpeg")}
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
              onPress={() => console.log(item.title)}
            />
          )}
        />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ListItemSeparator}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.subTitle}
            image={item.image}
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
});

export default AccountScreen;
