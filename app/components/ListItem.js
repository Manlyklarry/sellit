import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import colors from "../config/colors";

function ListItem({
  IconComponent,
  image,
  onPress,
  renderRightActions,
  showChevron = false,
  subTitle,
  title,
}) {
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
        <Text style={styles.title}>{title}</Text>
        {subTitle ? <Text style={styles.subTitle}>{subTitle}</Text> : null}
      </View>

      {showChevron ? (
        <MaterialCommunityIcons
          name="chevron-right"
          color={colors.medium}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 15,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
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
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.75,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ListItem;
