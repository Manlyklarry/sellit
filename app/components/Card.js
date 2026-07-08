import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../config/theme";

function Card({
  image,
  location = "East Legon",
  meta = "Listed today",
  onPress,
  subTitle,
  title,
}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.imageShade} />
      <View style={styles.priceBadge}>
        <Text style={styles.priceBadgeText}>{subTitle}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              color={theme.secondary}
              name="map-marker-radius-outline"
              size={15}
            />
            <Text style={styles.subTitle} numberOfLines={1}>
              {location}
            </Text>
          </View>
          <View style={styles.dot} />
          <Text style={styles.subTitle} numberOfLines={1}>
            {meta}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.sellerText}>Verified seller</Text>
          <MaterialCommunityIcons
            color={theme.primary}
            name="arrow-top-right"
            size={18}
          />
        </View>
      </View>
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: theme.mode === "dark" ? 0.32 : 0.1,
    shadowRadius: 18,
    elevation: 4,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 218,
  },
  imageShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 92,
    backgroundColor:
      theme.mode === "dark" ? "rgba(0,0,0,0.28)" : "rgba(16,17,20,0.06)",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  priceBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: theme.secondary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  priceBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
  subTitle: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.border,
    marginHorizontal: 8,
  },
  footerRow: {
    alignItems: "center",
    borderTopColor: theme.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
  },
  metaItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    maxWidth: "58%",
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  sellerText: {
    color: theme.foreground,
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    color: theme.foreground,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
    lineHeight: 22,
  },
});

export default Card;
