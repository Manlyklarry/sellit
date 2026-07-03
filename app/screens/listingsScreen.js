import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "../components/Card";
import colors from "../config/colors";
import formatCurrency from "../utils/currency";

const listings = [
  {
    id: 1,
    title: "Chair and laundry basket",
    price: 100,
    image: require("../assets/listings/chair-laundry-basket.png"),
  },
  {
    id: 2,
    title: "Charcoal stove",
    price: 35,
    image: require("../assets/listings/charcoal-stove.png"),
  },
  {
    id: 3,
    title: "Cocoa beans",
    price: 80,
    image: require("../assets/listings/cocoa-beans.png"),
  },
  {
    id: 4,
    title: "Kente cloth",
    price: 120,
    image: require("../assets/listings/kente-cloth.png"),
  },
  {
    id: 5,
    title: "Red bicycle",
    price: 250,
    image: require("../assets/listings/red-bicycle.png"),
  },
];

function ListingsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Card
              title={item.title}
              subTitle={formatCurrency(item.price)}
              image={item.image}
            />
          </View>
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
  list: {
    padding: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
});

export default ListingsScreen;
