import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { Platform, View } from "react-native";

export const isLiquidGlassEnabled =
  Platform.OS === "ios" &&
  isGlassEffectAPIAvailable() &&
  isLiquidGlassAvailable();

function LiquidGlassView({
  children,
  fallbackColor = "transparent",
  glassEffectStyle = "regular",
  isInteractive = false,
  style,
  tintColor,
  ...viewProps
}) {
  if (!isLiquidGlassEnabled) {
    return (
      <View
        {...viewProps}
        style={[{ backgroundColor: fallbackColor }, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <GlassView
      {...viewProps}
      glassEffectStyle={glassEffectStyle}
      isInteractive={isInteractive}
      style={style}
      tintColor={tintColor}
    >
      {children}
    </GlassView>
  );
}

export default LiquidGlassView;
