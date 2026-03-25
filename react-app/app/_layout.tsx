import { Stack } from "expo-router";
import {CourseContextProvider} from "@/context/CourseContext";

export default function RootLayout() {
  return (
      <CourseContextProvider>
          <Stack>

          </Stack>
      </CourseContextProvider>
  )
}
