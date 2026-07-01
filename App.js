import { SafeAreaProvider } from "react-native-safe-area-context";

import ViewImageScreen from "./app/screens/viewImageScreen";
import ListingDetailsScreen from "./app/screens/listingDetailsScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ListingDetailsScreen />
    </SafeAreaProvider>
  );
}
