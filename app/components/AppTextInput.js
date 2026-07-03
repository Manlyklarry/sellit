import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import colors from "../config/colors";

function AppTextInput({ icon, style, width = "100%", ...otherProps }) {
  return (
    <View
      style={[
        styles.container,
        { width },
        otherProps.multiline && styles.multilineContainer,
        style,
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          color={colors.medium}
          size={22}
          style={styles.icon}
        />
      ) : null}
      <TextInput
        placeholderTextColor={colors.medium}
        style={[
          styles.textInput,
          otherProps.multiline && styles.multilineTextInput,
        ]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#eee8e8",
  },
  icon: {
    marginRight: 10,
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
    minHeight: 120,
  },
  multilineTextInput: {
    minHeight: 96,
  },
  textInput: {
    flex: 1,
    color: colors.black,
    fontSize: 16,
    minWidth: 0,
  },
});

export default AppTextInput;
