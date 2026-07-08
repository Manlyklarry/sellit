import { StyleSheet, Text } from "react-native";

import { useAppTheme } from "../../config/theme";

function ErrorMessage({ error, visible }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  if (!visible || !error) return null;

  return <Text style={styles.error}>{error}</Text>;
}

const createStyles = (theme) =>
  StyleSheet.create({
  error: {
    color: theme.danger,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 10,
  },
});

export default ErrorMessage;
