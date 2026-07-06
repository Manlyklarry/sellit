import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { sendListingInquiry } from "../api/notifications";
import { deleteListing } from "../api/listings";
import { getCurrentUser } from "../auth/session";
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
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
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

  const handleInquiry = () => {
    Alert.alert(
      "Ask about item",
      "Send the seller a notification asking if this item is still available?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: sendInquiry,
        },
      ]
    );
  };

  const sendInquiry = async () => {
    setIsSendingInquiry(true);

    try {
      const currentUser = await getCurrentUser();

      if (isCurrentUsersListing(currentUser, listing)) {
        Alert.alert("This is your listing", "Buyers can ask you about this item.");
        return;
      }

      await sendListingInquiry({
        listingId: listing.id,
        message: `Hi, is "${listing.title}" still available?`,
        user: currentUser,
      });

      Alert.alert("Sent", "The seller has been notified.");
    } catch (error) {
      Alert.alert("Could not send message", error.message);
    } finally {
      setIsSendingInquiry(false);
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
          title={listing.sellerName || "MANLYKLARRY"}
          subTitle="5 Listings"
          image={require("../assets/profiles/larry.jpeg")}
          showChevron
          onPress={() => console.log("seller")}
        />
      </View>

      {canDelete ? (
        <View style={styles.actionContainer}>
          <AppButton
            color="secondary"
            disabled={isSendingInquiry}
            onPress={handleInquiry}
            title={isSendingInquiry ? "Sending..." : "Ask about item"}
          />
        </View>
      ) : null}

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

function isCurrentUsersListing(user, listing) {
  if (!user) return false;

  return Boolean(
    (listing.sellerUserId && listing.sellerUserId === user.id) ||
      (listing.sellerEmail && listing.sellerEmail === user.email)
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
  actionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  deleteContainer: {
    marginHorizontal: 20,
  },
});

export default ListingDetailsScreen;
