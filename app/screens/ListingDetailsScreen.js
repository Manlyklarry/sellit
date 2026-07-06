import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { deleteListing } from "../api/listings";
import AppButton from "../components/AppButton";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import { FEED_ROUTES } from "../navigation/routes";
import formatCurrency from "../utils/currency";

const defaultListing = {
  title: "Chair and laundry basket",
  price: 100,
  image: require("../assets/listings/chair-laundry-basket.png"),
};

function ListingDetailsScreen({ navigation, route }) {
  const listing = route.params?.listing || defaultListing;
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = typeof listing.id === "string";

  const handleDelete = () => {
    Alert.alert(
      "Delete listing",
      `Delete "${listing.title}"? This cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteCurrentListing,
        },
      ]
    );
  };

  const deleteCurrentListing = async () => {
    setIsDeleting(true);

    try {
      await deleteListing(listing.id);
      navigation.navigate(FEED_ROUTES.LISTINGS, {
        deletedListingId: listing.id,
      });
    } catch (error) {
      Alert.alert("Delete failed", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Image source={listing.image} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {listing.title}
        </Text>
        <Text style={styles.price}>{formatCurrency(listing.price)}</Text>
      </View>

      <View style={styles.userContainer}>
        <ListItem
          title="MANLYKLARRY"
          subTitle="5 Listings"
          image={require("../assets/profiles/larry.jpeg")}
          showChevron
          onPress={() => console.log("seller")}
        />
      </View>

      {canDelete ? (
        <View style={styles.deleteContainer}>
          <AppButton
            color="danger"
            disabled={isDeleting}
            onPress={handleDelete}
            title={isDeleting ? "Deleting..." : "Delete listing"}
          />
        </View>
      ) : null}
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
  deleteContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default ListingDetailsScreen;
