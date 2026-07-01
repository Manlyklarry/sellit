import { SafeAreaProvider } from "react-native-safe-area-context";

import ViewImageScreen from "./app/screens/viewImageScreen";
import WelcomeScreen from "./app/screens/welcomeScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}
