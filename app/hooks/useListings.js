import { useCallback, useEffect, useMemo, useState } from "react";

import { getListings, removeCachedListing } from "../api/listings";
import { filterListings } from "../utils/listingFilters";

const allCategoriesLabel = "All";

function useListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesLabel);
  const [usingCache, setUsingCache] = useState(false);

  const filteredListings = useMemo(
    () =>
      filterListings(listings, {
        query: searchQuery,
        selectedCategory,
      }),
    [listings, searchQuery, selectedCategory]
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== allCategoriesLabel;

  const loadListings = useCallback(async ({ refreshingFeed = false } = {}) => {
    if (refreshingFeed) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await getListings();

      setListings(result.data);

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

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(allCategoriesLabel);
  }, []);

  const removeListing = useCallback((deletedListingId) => {
    setListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== deletedListingId)
    );
    removeCachedListing(deletedListingId);
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  return {
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
  };
}

export default useListings;
