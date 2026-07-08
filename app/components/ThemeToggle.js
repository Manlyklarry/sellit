import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

import { useAppTheme } from "../config/theme";

function ThemeToggle({ compact = false }) {
  const { isDark, theme, toggleTheme } = useAppTheme();
  const progress = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const travel = compact ? 22 : 28;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: isDark ? 1 : 0,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [isDark, progress]);

  return (
    <Pressable
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.track,
        {
          backgroundColor: isDark ? theme.secondarySoft : theme.primarySoft,
          borderColor: theme.border,
          width: compact ? 54 : 62,
        },
        pressed && styles.pressed,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: isDark ? theme.secondary : theme.primary,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, travel],
                }),
              },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isDark ? "weather-night" : "white-balance-sunny"}
          color="#ffffff"
          size={compact ? 14 : 16}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.78,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    padding: 3,
  },
});

export default ThemeToggle;
