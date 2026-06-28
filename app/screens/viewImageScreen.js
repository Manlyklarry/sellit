import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../config/colors";

function ViewImageScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.actions} edges={["top"]}>
        <Pressable
          style={[styles.actionButton, styles.closeButton]}
          onPress={() => console.log("close image")}
        >
          <Text style={styles.actionText}>x</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => console.log("delete image")}
        >
          <Text style={styles.actionText}>del</Text>
        </Pressable>
      </SafeAreaView>

      <Image
        source={require("../assets/chair.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
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
    top: 0,
    left: 30,
    right: 30,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.secondary,
  },
  actionText: {
    color: colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ViewImageScreen;
