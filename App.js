import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{flex:1}}>
        <AppNavigator />
        </GestureHandlerRootView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}