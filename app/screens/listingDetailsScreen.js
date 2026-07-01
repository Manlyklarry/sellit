import { Image, StyleSheet, Text, View } from "react-native";

import ListItem from "../components/ListItem";
import colors from "../config/colors";
import formatCurrency from "../utils/currency";

function ListingDetailsScreen() {
  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/listings/chair-laundry-basket.png")}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Chair and laundry basket</Text>
        <Text style={styles.price}>{formatCurrency(100)}</Text>
      </View>

      <View style={styles.userContainer}>
        <ListItem
          title="MANLYKLARRY"
          subTitle="5 Listings"
          image={require("../assets/profiles/larry.jpeg")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginHorizontal: 20,
  },
});

export default ListingDetailsScreen;
