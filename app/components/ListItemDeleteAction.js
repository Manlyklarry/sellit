import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import colors from "../config/colors";

function ListItemDeleteAction({ onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name="trash-can" color={colors.white} size={32} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ListItemDeleteAction;
