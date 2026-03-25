import {View, Text} from "react-native"
import Button from "@/components/Button";
// import {useCourse} from "@/context/CourseContext";
// import {useState} from "react";
import {useRouter} from "expo-router";

const router = useRouter();

export default function Play(){

    // const courseContext = useCourse();
    // const courses = courseContext.courses;
    // const [targetIds, setIds] = useState<number[]>([]);

    // const generateCourse = () => {
    //     const id = courses.length + 1;
    //     const target = {
    //         id: targetIds.length + 1,
    //         x: Math.floor(Math.random() * 500),
    //         y: Math.floor(Math.random() * 800),
    //     }
    // }

    return (
      <View>
          <Text>test</Text>
          <Button name={"Swing"} onPress={() => router.push("/swing")} />
      </View>
    );
}