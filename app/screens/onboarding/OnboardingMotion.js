import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import { MOTION } from "../../config/motion";

const entrances = {
  fade: FadeIn,
  left: FadeInLeft,
  right: FadeInRight,
  scale: ZoomIn,
  up: FadeInUp,
};

export function OnboardingEntrance({ children, delay = 0, style, variant = "up" }) {
  const animation = entrances[variant] ?? entrances.up;
  const entering = animation
    .duration(MOTION.duration.entrance)
    .delay(delay)
    .reduceMotion(ReduceMotion.System);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

export function OnboardingFloat({
  children,
  delay = 0,
  distance = MOTION.floatDistance,
  duration = MOTION.duration.ambient,
  style,
}) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      offset.value = 0;
      return undefined;
    }

    offset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-distance, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(distance, { duration: duration * 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      )
    );

    return () => cancelAnimation(offset);
  }, [delay, distance, duration, offset, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value },
      { rotate: `${offset.value * 0.18}deg` },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
