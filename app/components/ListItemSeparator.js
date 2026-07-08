import { StyleSheet, View } from "react-native";

import { useAppTheme } from "../config/theme";

function ListItemSeparator() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return <View style={styles.separator} />;
}

const createStyles = (theme) =>
  StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: theme.border,
  },
});

export default ListItemSeparator;
