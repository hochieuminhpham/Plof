import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Plof",
        }}
      />
      <Stack.Screen name="play" options={{ title: "Plof" }} />
      <Stack.Screen name="swing" options={{ title: "Plof" }} />
    </Stack>
  );
}
