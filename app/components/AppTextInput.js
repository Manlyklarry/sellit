import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import colors from "../config/colors";

function AppTextInput({ icon, style, width = "100%", ...otherProps }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = otherProps.secureTextEntry;

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
        secureTextEntry={isPassword && !passwordVisible}
      />
      {isPassword ? (
        <Pressable
          accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => setPasswordVisible((visible) => !visible)}
          style={styles.passwordToggle}
        >
          <MaterialCommunityIcons
            name={passwordVisible ? "eye-off" : "eye"}
            color={colors.medium}
            size={22}
          />
        </Pressable>
      ) : null}
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
  passwordToggle: {
    marginLeft: 10,
    padding: 4,
  },
  textInput: {
    flex: 1,
    color: colors.black,
    fontSize: 16,
    minWidth: 0,
  },
});

export default AppTextInput;
