import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../config/colors";

function ViewImageScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.actions} edges={["top"]}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.closeButton,
            pressed && styles.pressed,
          ]}
          onPress={() => console.log("close image")}
        >
          <Text style={styles.actionText}>X</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
          onPress={() => console.log("delete image")}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </SafeAreaView>

      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/chair.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <SafeAreaView style={styles.captionContainer} edges={["bottom"]}>
        <Text style={styles.caption}>Chair and laundry basket</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  actions: {
    position: "absolute",
    top: 16,
    left: 24,
    right: 24,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    minWidth: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  actionText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  caption: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  captionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.secondary,
  },
  deleteText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "80%",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ViewImageScreen;
