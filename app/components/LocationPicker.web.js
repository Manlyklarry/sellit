import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppActivityIndicator from "./AppActivityIndicator";
import { useAppTheme } from "../config/theme";

function LocationPicker({
  address,
  error,
  loading,
  location,
  onRefresh,
  refreshing,
}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const coords = location?.coords;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            color={theme.primary}
            size={22}
          />
          <Text style={styles.title}>Location</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            refreshing && styles.refreshButtonActive,
            pressed && styles.pressed,
          ]}
          disabled={refreshing}
          onPress={onRefresh}
        >
          {refreshing ? (
            <AppActivityIndicator
              compact
              message=""
              size={30}
              style={styles.refreshAnimation}
            />
          ) : (
            <MaterialCommunityIcons
              name="crosshairs-gps"
              color={theme.primary}
              size={20}
            />
          )}
          <Text style={styles.refreshText}>
            {refreshing ? "Updating" : "Update"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.mapPlaceholder}>
        {loading ? (
          <AppActivityIndicator message="Finding your location..." />
        ) : (
          <MaterialCommunityIcons
            name={coords ? "map-marker-radius-outline" : "map-marker-off"}
            color={theme.muted}
            size={34}
          />
        )}
      </View>

      <Text style={styles.address} numberOfLines={2}>
        {loading
          ? "Finding your live location..."
          : address ||
            (coords
              ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
              : "Location unavailable")}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    address: {
      color: theme.foreground,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 10,
    },
    container: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      marginTop: 4,
      marginBottom: 4,
    },
    error: {
      color: theme.danger,
      fontSize: 13,
      marginTop: 6,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    mapPlaceholder: {
      height: 150,
      borderRadius: 12,
      backgroundColor: theme.mutedSurface,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.7,
    },
    refreshButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingLeft: 10,
    },
    refreshButtonActive: {
      opacity: 0.85,
    },
    refreshAnimation: {
      marginVertical: -8,
      paddingVertical: 0,
    },
    refreshText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "700",
      marginLeft: 4,
    },
    title: {
      color: theme.foreground,
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 6,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

export default LocationPicker;
