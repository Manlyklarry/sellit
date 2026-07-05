import { DefaultTheme } from "@react-navigation/native";

import colors from "../config/colors";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.light,
    border: "rgba(0, 0, 0, 0.08)",
    card: colors.white,
    primary: colors.primary,
    text: colors.black,
  },
};

export default navigationTheme;
