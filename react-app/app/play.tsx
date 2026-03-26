import {View} from "react-native"
import Button from "@/components/Button";
import {useCourse} from "@/context/CourseContext";
import {useRouter} from "expo-router";

export default function Play() {
    const router = useRouter();
    const {courses} = useCourse();

    return (
        <View>
            <Button name={"Next Target"} onPress={() => router.push(`/nextTarget?id=${encodeURIComponent(courses[courses.length-1].id!)}`)} />
            <Button name={"Swing"} onPress={() => router.push(`/swing?id=${encodeURIComponent(courses[courses.length-1].id!)}`)} />
            <Button name={"History"} onPress={() => router.push("/history")} />
        </View>
    );
}
