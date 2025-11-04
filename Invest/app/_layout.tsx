import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SweetAlertProvider } from "@/components/ui/alerts/sweetAlert";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SweetAlertProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SweetAlertProvider>
    </SafeAreaProvider>
  );
}