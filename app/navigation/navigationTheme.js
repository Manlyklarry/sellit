import { DarkTheme, DefaultTheme } from "@react-navigation/native";

function createNavigationTheme(theme) {
  const baseTheme = theme.mode === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    dark: theme.mode === "dark",
    colors: {
      ...baseTheme.colors,
      background: theme.background,
      border: theme.border,
      card: theme.card,
      primary: theme.primary,
      text: theme.foreground,
    },
  };
}

export default createNavigationTheme;
