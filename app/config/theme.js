import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { palettes } from "./colors";

const STORAGE_KEY = "sellit.theme";

const ThemeContext = createContext({
  isDark: false,
  mode: "light",
  setMode: () => {},
  theme: palettes.light,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState(systemScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedMode) => {
        if (!mounted) return;
        if (savedMode === "light" || savedMode === "dark") {
          setModeState(savedMode);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = useCallback((nextMode) => {
    if (nextMode !== "light" && nextMode !== "dark") return;

    setModeState(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      isDark: mode === "dark",
      mode,
      setMode,
      theme: palettes[mode],
      toggleTheme,
    }),
    [mode, setMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
