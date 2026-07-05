import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";

import ProgressBar from "./ProgressBar";
import colors from "../config/colors";

function UploadScreen({ done = false, progress = 0, visible = false }) {
  const successScale = useRef(new Animated.Value(0.65)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!done || !visible) {
      successScale.setValue(0.65);
      successOpacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [done, successOpacity, successScale, visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.panel}>
          {done ? (
            <Animated.View
              style={[
                styles.successBadge,
                {
                  opacity: successOpacity,
                  transform: [{ scale: successScale }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="check-bold"
                color={colors.white}
                size={62}
              />
            </Animated.View>
          ) : (
            <LottieView
              autoPlay
              loop
              source={require("../assets/animations/loading.json")}
              style={styles.animation}
            />
          )}
          <Text style={styles.title}>
            {done ? "Listing posted" : "Posting your listing"}
          </Text>
          <Text style={styles.subtitle}>
            {done
              ? "Your item is ready for buyers."
              : "Uploading photos and listing details..."}
          </Text>
          <ProgressBar progress={done ? 1 : progress} />
          <Text style={styles.percent}>
            {Math.round((done ? 1 : progress) * 100)}%
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
    height: 150,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  panel: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 24,
  },
  percent: {
    color: colors.medium,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: colors.medium,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: "center",
  },
  successBadge: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    marginBottom: 22,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    color: colors.black,
    fontSize: 22,
    fontWeight: "800",
    marginTop: -12,
    marginBottom: 6,
  },
});

export default UploadScreen;
