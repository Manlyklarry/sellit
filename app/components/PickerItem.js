import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

function PickerItem({ isSelected, item, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selectedContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: item.backgroundColor || colors.light },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon || "tag-outline"}
          color={item.iconColor || colors.white}
          size={22}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
          {item.label}
        </Text>
        {item.description ? (
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        ) : null}
      </View>

      {isSelected ? (
        <MaterialCommunityIcons
          name="check-circle"
          color={colors.primary}
          size={24}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          color={colors.medium}
          size={22}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  description: {
    color: colors.medium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  selectedContainer: {
    backgroundColor: "#fff2f3",
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
});

export default PickerItem;
