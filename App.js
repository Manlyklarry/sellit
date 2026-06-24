import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Text
          style={styles.text}
          numberOfLines={2}
          onPress={() => console.log("Text Pressed")}
        >
          Sellit - Marketplace to sell the stuff you no londer use👋. I want to
          make this text really long to see what happens. May be make the text a
          little bit longer so we see clearly whats happening under the hood
          sample text integration is working
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
