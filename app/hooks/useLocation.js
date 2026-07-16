import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

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
  const requestId = useRef(0);
  const [address, setAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const reverseGeocode = useCallback(async ({ latitude, longitude }) => {
    const currentRequest = ++requestId.current;
    if (isMounted.current) setGeocoding(true);

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const locationAddress = formatAddress(results[0]);
      if (isMounted.current && currentRequest === requestId.current) {
        setAddress(locationAddress);
      }
      return locationAddress;
    } catch {
      if (isMounted.current && currentRequest === requestId.current) setAddress("");
      return "";
    } finally {
      if (isMounted.current && currentRequest === requestId.current) {
        setGeocoding(false);
      }
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
        accuracy: Location.Accuracy.Balanced,
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
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      requestId.current += 1;
    };
  }, []);

  return { address, error, geocoding, getLocation, loading, location };
}

export default useLocation;
