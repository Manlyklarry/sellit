import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import AppActivityIndicator from "./AppActivityIndicator";
import colors from "../config/colors";

function LocationPicker({
  address,
  error,
  loading,
  location,
  onRefresh,
  refreshing,
}) {
  const coords = location?.coords;
  const region = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            color={colors.primary}
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
              color={colors.primary}
              size={20}
            />
          )}
          <Text style={styles.refreshText}>
            {refreshing ? "Updating" : "Update"}
          </Text>
        </Pressable>
      </View>

      {region ? (
        <MapView
          style={styles.map}
          region={region}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={region} />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          {loading ? (
            <AppActivityIndicator message="Finding your location..." />
          ) : (
            <MaterialCommunityIcons
              name="map-marker-off"
              color={colors.medium}
              size={34}
            />
          )}
        </View>
      )}

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

const styles = StyleSheet.create({
  address: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee8e8",
    padding: 14,
    marginTop: 4,
    marginBottom: 4,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.light,
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
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  title: {
    color: colors.black,
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
