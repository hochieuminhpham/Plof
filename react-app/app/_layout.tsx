import { Stack } from "expo-router";
import {CourseContextProvider} from "@/context/CourseContext";

export default function RootLayout() {
  return (
      <CourseContextProvider>
          <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#2D6A4F"
                },

                headerTintColor: "white"
            }}
          >
            <Stack.Screen
                name={"nextTarget"}
                options={{
                    title: "Target Direction"
                }}
            />
            <Stack.Screen
                name={"index"}
                options={{
                    title: "PLOF"
                }}
            />
          </Stack>
      </CourseContextProvider>
  )
}
