import { SafeAreaProvider } from "react-native-safe-area-context";

import ViewImageScreen from "./app/screens/viewImageScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ViewImageScreen />
    </SafeAreaProvider>
  );
}
