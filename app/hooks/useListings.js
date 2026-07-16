import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getListings, removeCachedListing } from "../api/listings";
import { filterListings } from "../utils/listingFilters";
import {
  ALL_LISTINGS_CATEGORY,
  getListingCategoryByLabel,
} from "../../shared/listingCategories";

function useListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_LISTINGS_CATEGORY);
  const [usingCache, setUsingCache] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const activeRequest = useRef(0);
  const mounted = useRef(true);
  const nextCursorRef = useRef(null);
  const categoryId = getListingCategoryByLabel(selectedCategory)?.id || null;

  const filteredListings = useMemo(
    () =>
      usingCache
        ? filterListings(listings, { query: searchQuery, selectedCategory })
        : listings,
    [listings, searchQuery, selectedCategory, usingCache]
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== ALL_LISTINGS_CATEGORY;

  const loadListings = useCallback(
    async ({ append = false, refreshingFeed = false } = {}) => {
      const cursor = append ? nextCursorRef.current : null;
      if (append && !cursor) return;

      const requestId = ++activeRequest.current;
      if (refreshingFeed) {
        setRefreshing(true);
      } else if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const result = await getListings({ categoryId, cursor, search: searchQuery });
        if (!mounted.current || requestId !== activeRequest.current) return;

        setListings((current) =>
          append ? mergeListings(current, result.data) : result.data
        );
        nextCursorRef.current = result.nextCursor || null;
        setNextCursor(nextCursorRef.current);
        setError(result.error?.message || null);
        setUsingCache(result.stale);
      } catch (loadError) {
        if (!mounted.current || requestId !== activeRequest.current) return;
        setError(loadError.message);
        setUsingCache(false);
      } finally {
        if (mounted.current && requestId === activeRequest.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [categoryId, searchQuery]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(ALL_LISTINGS_CATEGORY);
  }, []);

  const removeListing = useCallback((deletedListingId) => {
    setListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== deletedListingId)
    );
    removeCachedListing(deletedListingId).catch(() => null);
  }, []);

  useEffect(() => {
    activeRequest.current += 1;
    const timer = setTimeout(() => loadListings(), 300);
    return () => clearTimeout(timer);
  }, [loadListings]);

  useEffect(
    () => () => {
      mounted.current = false;
      activeRequest.current += 1;
    },
    []
  );

  return {
    clearFilters,
    error,
    filteredListings,
    hasActiveFilters,
    hasMore: Boolean(nextCursor),
    isLoading,
    isLoadingMore,
    listings,
    loadListings,
    loadMore: () => loadListings({ append: true }),
    refreshing,
    removeListing,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    usingCache,
  };
}

function mergeListings(current, incoming) {
  const listingsById = new Map(current.map((listing) => [listing.id, listing]));
  incoming.forEach((listing) => listingsById.set(listing.id, listing));
  return [...listingsById.values()];
}

export default useListings;
