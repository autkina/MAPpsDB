import { Stack } from 'expo-router';
import { DatabaseProvider } from "@/contexts/DatabaseContext";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
      </Stack>
	</DatabaseProvider>
  );
}
