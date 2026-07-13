import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { LOCATION_DEFAULTS } from "../config/constants";

export function formatAddress(addressResult) {
  if (!addressResult) return "";

  const parts = [
    addressResult.name,
    addressResult.street,
    addressResult.district,
    addressResult.city,
    addressResult.region,
    addressResult.country,
  ].filter(Boolean);

  return [...new Set(parts)].join(", ");
}

function useLocation() {
  const isMounted = useRef(true);
  const locationSubscription = useRef(null);
  const [address, setAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const reverseGeocode = useCallback(async ({ latitude, longitude }) => {
    if (isMounted.current) setGeocoding(true);

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const locationAddress = formatAddress(results[0]);
      if (isMounted.current) setAddress(locationAddress);
      return locationAddress;
    } catch {
      if (isMounted.current) setAddress("");
      return "";
    } finally {
      if (isMounted.current) setGeocoding(false);
    }
  }, []);

  const getLocation = useCallback(async () => {
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        if (isMounted.current) {
          setLocation(null);
          setAddress("");
          setError("Location permission was denied.");
        }
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (isMounted.current) setLocation(currentLocation);
      const locationAddress = await reverseGeocode(currentLocation.coords);
      return { address: locationAddress, location: currentLocation };
    } catch (locationError) {
      if (isMounted.current) {
        setLocation(null);
        setAddress("");
        setError(locationError.message);
      }
      return null;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [reverseGeocode]);

  useEffect(() => {
    const startLocationUpdates = async () => {
      const snapshot = await getLocation();
      if (!snapshot?.location || locationSubscription.current) return;

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_DEFAULTS.distanceIntervalMeters,
          timeInterval: LOCATION_DEFAULTS.updateIntervalMs,
        },
        (updatedLocation) => {
          if (!isMounted.current) return;

          setLocation(updatedLocation);
          reverseGeocode(updatedLocation.coords);
        }
      );
    };

    startLocationUpdates();

    return () => {
      isMounted.current = false;
      locationSubscription.current?.remove();
    };
  }, [getLocation]);

  return { address, error, geocoding, getLocation, loading, location };
}

export default useLocation;
