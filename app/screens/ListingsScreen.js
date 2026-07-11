import { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import AppActivityIndicator from "../components/AppActivityIndicator";
import Card from "../components/Card";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import useListings from "../hooks/useListings";
import { FEED_ROUTES } from "../navigation/routes";
import { getListingCategory } from "../utils/listingFilters";
import formatCurrency from "../utils/currency";
import { listingCategories, sampleListings } from "./listingsData";

function ListingsScreen({ navigation, route }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const {
    clearFilters,
    error,
    filteredListings,
    hasActiveFilters,
    isLoading,
    listings,
    loadListings,
    refreshing,
    removeListing,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    usingCache,
  } = useListings();

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [headerOpacity]);

  useEffect(() => {
    const deletedListingId = route.params?.deletedListingId;
    if (!deletedListingId) return;

    removeListing(deletedListingId);
    navigation.setParams({ deletedListingId: undefined });
  }, [navigation, removeListing, route.params?.deletedListingId]);

  const handleRefresh = () => {
    loadListings({ refreshingFeed: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {isLoading ? (
        <AppActivityIndicator compact message="Loading listings..." />
      ) : null}
      <FlatList
        data={filteredListings}
        keyExtractor={(listing) => listing.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {refreshing ? (
              <AppActivityIndicator compact message="Refreshing listings..." />
            ) : null}
            <Animated.View
              style={[
                styles.hero,
                {
                  opacity: headerOpacity,
                  transform: [
                    {
                      translateY: headerOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text style={styles.eyebrow}>Sellit marketplace</Text>
                  <Text style={styles.heading}>Browse nearby finds</Text>
                  <Text style={styles.heroCopy}>
                    Search local listings and filter by category.
                  </Text>
                </View>
                <ThemeToggle compact />
              </View>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  color={theme.muted}
                  name="magnify"
                  size={22}
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setSearchQuery}
                  placeholder="Search chairs, bikes, food..."
                  placeholderTextColor={theme.muted}
                  returnKeyType="search"
                  style={styles.searchInput}
                  value={searchQuery}
                />
                <Pressable
                  accessibilityLabel={
                    hasActiveFilters ? "Clear filters" : "Filters active"
                  }
                  accessibilityRole="button"
                  onPress={hasActiveFilters ? clearFilters : undefined}
                  style={styles.filterButton}
                >
                  <MaterialCommunityIcons
                    color="#ffffff"
                    name={hasActiveFilters ? "close" : "tune-variant"}
                    size={18}
                  />
                </Pressable>
              </View>
              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statValue}>{listings.length}</Text>
                  <Text style={styles.statLabel}>live listings</Text>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <Text style={styles.statValue}>GHC</Text>
                  <Text style={styles.statLabel}>local pricing</Text>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <Text style={styles.statValue}>24h</Text>
                  <Text style={styles.statLabel}>fresh drops</Text>
                </View>
              </View>
            </Animated.View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Browse categories</Text>
              <Text style={styles.sectionAction}>
                {selectedCategory === "All" ? "Nearby" : selectedCategory}
              </Text>
            </View>
            <View style={styles.categoryGrid}>
              {listingCategories.map((category) => {
                const selected = selectedCategory === category.label;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={category.label}
                    onPress={() => setSelectedCategory(category.label)}
                    style={[
                      styles.categoryChip,
                      selected && styles.categoryChipSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor: selected
                            ? theme[category.color]
                            : theme[`${category.color}Soft`],
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={selected ? "#ffffff" : theme[category.color]}
                        name={category.icon}
                        size={20}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest listings</Text>
              <Text style={styles.sectionAction}>
                {filteredListings.length} shown
              </Text>
            </View>
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
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                color={theme.muted}
                name="magnify-close"
                size={34}
              />
              <Text style={styles.emptyTitle}>No matching items</Text>
              <Text style={styles.emptyText}>
                Try another search term or choose a different category.
              </Text>
              {hasActiveFilters ? (
                <Pressable onPress={clearFilters} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear filters</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null
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
          const image = item.image || sampleListings[0].image;

          return (
            <View style={styles.cardContainer}>
              <Card
                title={item.title}
                subTitle={formatCurrency(item.price)}
                image={image}
                location={item.location?.address || "Accra"}
                meta={getListingCategory(item)}
                sellerImage={item.sellerImageSource}
                sellerName={item.sellerDisplayName}
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

const createStyles = (theme) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  list: {
    padding: 18,
    paddingBottom: 120,
  },
  cardContainer: {
    marginBottom: 20,
  },
  errorNotice: {
    backgroundColor: theme.danger,
    borderRadius: 12,
    marginBottom: 20,
    padding: 12,
  },
  errorText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  notice: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    padding: 12,
  },
  noticeText: {
    color: theme.muted,
    fontWeight: "600",
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
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  heading: {
    color: theme.foreground,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    marginTop: 4,
  },
  heroCopy: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 4,
  },
  categoryChip: {
    alignItems: "center",
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    height: 42,
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 12,
  },
  categoryChipSelected: {
    borderColor: theme.primary,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.mode === "dark" ? 0.24 : 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  categoryIcon: {
    alignItems: "center",
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    marginRight: 7,
    width: 26,
  },
  categoryText: {
    color: theme.foreground,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 16,
  },
  categoryTextSelected: {
    color: theme.primary,
  },
  clearButton: {
    backgroundColor: theme.primary,
    borderRadius: 999,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 4,
    padding: 24,
  },
  emptyText: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 5,
    textAlign: "center",
  },
  emptyTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: theme.primary,
    borderRadius: 13,
    height: 34,
    justifyContent: "center",
    marginLeft: "auto",
    width: 34,
  },
  hero: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: theme.mode === "dark" ? 0.22 : 0.08,
    shadowRadius: 22,
    elevation: 3,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: theme.input,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 18,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: theme.foreground,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    minWidth: 0,
    paddingVertical: 0,
  },
  sectionAction: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "900",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  statDivider: {
    backgroundColor: theme.border,
    height: 32,
    width: 1,
  },
  statLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  statsRow: {
    alignItems: "center",
    backgroundColor: theme.cardMuted,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statValue: {
    color: theme.foreground,
    fontSize: 16,
    fontWeight: "900",
  },
});

export default ListingsScreen;
