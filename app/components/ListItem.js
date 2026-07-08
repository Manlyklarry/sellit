import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useAppTheme } from "../config/theme";

function ListItem({
  IconComponent,
  image,
  onPress,
  renderRightActions,
  rightText,
  showBadge = false,
  showChevron = false,
  subTitle,
  subTitleNumberOfLines = 2,
  title,
  titleNumberOfLines = 1,
}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const content = (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {image ? (
        <Image source={image} style={styles.image} />
      ) : IconComponent ? (
        <View style={styles.icon}>{IconComponent}</View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {title ? title.charAt(0).toUpperCase() : ""}
          </Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text
          style={styles.title}
          numberOfLines={titleNumberOfLines}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {subTitle ? (
          <Text
            style={styles.subTitle}
            numberOfLines={subTitleNumberOfLines}
            ellipsizeMode="tail"
          >
            {subTitle}
          </Text>
        ) : null}
      </View>

      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      {showBadge ? <View style={styles.badge} /> : null}
      {showChevron ? (
        <MaterialCommunityIcons
          name="chevron-right"
          color={theme.muted}
          size={25}
        />
      ) : null}
    </Pressable>
  );

  if (renderRightActions) {
    return (
      <Swipeable renderRightActions={renderRightActions}>{content}</Swipeable>
    );
  }

  return content;
}

const createStyles = (theme) =>
  StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    padding: 15,
    minHeight: 78,
  },
  badge: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.primary,
    marginLeft: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    minWidth: 0,
  },
  icon: {
    marginRight: 0,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.75,
  },
  rightText: {
    color: theme.muted,
    fontSize: 12,
    marginLeft: 8,
    maxWidth: 54,
  },
  subTitle: {
    color: theme.muted,
    lineHeight: 19,
    marginTop: 3,
  },
  title: {
    color: theme.foreground,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ListItem;
