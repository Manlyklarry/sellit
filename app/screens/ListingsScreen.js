import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getListings } from "../api/listings";
import AppActivityIndicator from "../components/AppActivityIndicator";
import Card from "../components/Card";
import colors from "../config/colors";
import { FEED_ROUTES } from "../navigation/routes";
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

function ListingsScreen({ navigation }) {
  const [feedListings, setFeedListings] = useState(listings);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingCache, setUsingCache] = useState(false);

  const loadListings = useCallback(async ({ refreshingFeed = false } = {}) => {
    if (refreshingFeed) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await getListings();

      if (result.data.length) {
        setFeedListings(result.data);
      }

      setError(result.error?.message || null);
      setUsingCache(result.stale);
    } catch (loadError) {
      setError(loadError.message);
      setUsingCache(false);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleRefresh = () => {
    loadListings({ refreshingFeed: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {isLoading ? (
        <AppActivityIndicator compact message="Loading listings..." />
      ) : null}
      <FlatList
        data={feedListings}
        keyExtractor={(listing) => listing.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {refreshing ? (
              <AppActivityIndicator compact message="Refreshing listings..." />
            ) : null}
            {usingCache ? (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>
                  You're offline. Showing the latest saved listings.
                </Text>
              </View>
            ) : null}
            {error && !usingCache ? (
              <View style={styles.errorNotice}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </>
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
        renderItem={({ item }) => {
          const image = item.image || listings[0].image;

          return (
            <View style={styles.cardContainer}>
              <Card
                title={item.title}
                subTitle={formatCurrency(item.price)}
                image={image}
                onPress={() =>
                  navigation.navigate(FEED_ROUTES.DETAILS, {
                    listing: { ...item, image },
                  })
                }
              />
            </View>
          );
        }}
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
    paddingBottom: 120,
  },
  cardContainer: {
    marginBottom: 20,
  },
  errorNotice: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    marginBottom: 20,
    padding: 12,
  },
  errorText: {
    color: colors.white,
    fontWeight: "600",
  },
  notice: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 20,
    padding: 12,
  },
  noticeText: {
    color: colors.medium,
    fontWeight: "600",
  },
});

export default ListingsScreen;
