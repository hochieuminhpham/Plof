import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCourse } from "@/context/CourseContext";

export default function Badge() {
  const { courses, calculateDistance } = useCourse();
  return (
    <View style={styles.badge}>
      <Text>Target:</Text>
      <Text>{Math.floor(calculateDistance(courses[0].id))}</Text>
      <Pressable></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "green",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    alignSelf: "flex-end",
    paddingHorizontal: 60,
    paddingVertical: 20,
    marginTop: 20,
  },
});
