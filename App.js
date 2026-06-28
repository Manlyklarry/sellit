import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={[styles.box, styles.small]}>
          <Text style={styles.text}>flex: 1</Text>
        </View>

        <View style={[styles.box, styles.medium]}>
          <Text style={styles.text}>flex: 2</Text>
        </View>

        <View style={[styles.box, styles.large]}>
          <Text style={styles.text}>flex: 3</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    flex: 1,
    backgroundColor: "tomato",
  },
  medium: {
    flex: 2,
    backgroundColor: "dodgerblue",
  },
  large: {
    flex: 3,
    backgroundColor: "seagreen",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
