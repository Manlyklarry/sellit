import { StyleSheet, Text } from "react-native";

import colors from "../../config/colors";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return <Text style={styles.error}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 10,
  },
});

export default ErrorMessage;
