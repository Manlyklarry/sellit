import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { sendListingInquiry } from "../api/notifications";
import { deleteListing } from "../api/listings";
import { getCurrentUser } from "../auth/session";
import AppButton from "../components/AppButton";
import ListItem from "../components/ListItem";
import { useAppTheme } from "../config/theme";
import { FEED_ROUTES } from "../navigation/routes";
import formatCurrency from "../utils/currency";

const defaultListing = {
  title: "Chair and laundry basket",
  price: 100,
  image: require("../assets/listings/chair-laundry-basket.png"),
};

function ListingDetailsScreen({ navigation, route }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const listing = route.params?.listing || defaultListing;
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const isBackendListing = typeof listing.id === "string";
  const isOwnListing = isCurrentUsersListing(currentUser, listing);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((user) => {
      if (mounted) setCurrentUser(user);
    });

    return () => {
      mounted = false;
    };
  }, []);

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
      if (isOwnListing) {
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageWrap}>
        <Image source={listing.image} style={styles.image} />
        <View style={styles.imageOverlay} />
        <View style={styles.pricePill}>
          <Text style={styles.price}>{formatCurrency(listing.price)}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.eyebrow}>Available now</Text>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {listing.title}
        </Text>
        <View style={styles.quickFacts}>
          <View style={styles.fact}>
            <MaterialCommunityIcons
              color={theme.secondary}
              name="map-marker-radius-outline"
              size={18}
            />
            <Text style={styles.factText}>
              {listing.location?.address || "Accra"}
            </Text>
          </View>
          <View style={styles.fact}>
            <MaterialCommunityIcons
              color={theme.accent}
              name="shield-check-outline"
              size={18}
            />
            <Text style={styles.factText}>Verified seller</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.panelTitle}>Item notes</Text>
        <Text style={styles.description}>
          {listing.description ||
            "A clean, ready-to-pick-up item from a local seller. Message before visiting to confirm availability and pickup details."}
        </Text>
      </View>

      <View style={styles.sellerHeader}>
        <Text style={styles.panelTitle}>Seller</Text>
        <Text style={styles.sellerMeta}>Usually replies quickly</Text>
      </View>
      <View style={styles.userContainer}>
        <ListItem
          title={listing.sellerName || "MANLYKLARRY"}
          subTitle="5 active listings"
          image={require("../assets/profiles/larry.jpeg")}
          showChevron
          onPress={() => console.log("seller")}
        />
      </View>

      {isBackendListing && !isOwnListing ? (
        <View style={styles.actionContainer}>
          <AppButton
            color="secondary"
            disabled={isSendingInquiry}
            onPress={handleInquiry}
            title={isSendingInquiry ? "Sending..." : "Ask about item"}
          />
        </View>
      ) : null}

      {isBackendListing && isOwnListing ? (
        <View style={styles.deleteContainer}>
          <AppButton
            color="danger"
            disabled={isDeleting}
            onPress={handleDelete}
            title={isDeleting ? "Deleting..." : "Delete listing"}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function isCurrentUsersListing(user, listing) {
  if (!user) return false;

  return Boolean(
    (listing.sellerUserId && listing.sellerUserId === user.id) ||
      (listing.sellerEmail && listing.sellerEmail === user.email)
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    color: theme.muted,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 8,
  },
  eyebrow: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    height: 330,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      theme.mode === "dark" ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.04)",
  },
  imageWrap: {
    backgroundColor: theme.mutedSurface,
    overflow: "hidden",
  },
  infoPanel: {
    backgroundColor: theme.cardMuted,
    borderColor: theme.border,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
  },
  fact: {
    alignItems: "center",
    backgroundColor: theme.cardMuted,
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  factText: {
    color: theme.foreground,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 5,
  },
  panelTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  price: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  pricePill: {
    backgroundColor: theme.primary,
    borderRadius: 999,
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    position: "absolute",
    right: 16,
  },
  quickFacts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  title: {
    color: theme.foreground,
    fontSize: 24,
    fontWeight: "900",
  },
  userContainer: {
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  sellerHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 22,
  },
  sellerMeta: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "800",
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
