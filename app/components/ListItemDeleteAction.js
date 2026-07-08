import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { useAppTheme } from "../config/theme";

function ListItemDeleteAction({ onPress }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name="trash-can" color="#ffffff" size={32} />
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
  container: {
    width: 80,
    backgroundColor: theme.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ListItemDeleteAction;
