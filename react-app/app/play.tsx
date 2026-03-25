import {View, Text, FlatList} from "react-native"
import Button from "@/components/Button";
import {useCourse} from "@/context/CourseContext";
import {useState, useEffect} from "react";
import {useRouter} from "expo-router";

const router = useRouter();

export default function Play() {
    const courseContext = useCourse();
    const [targetId, setTargetId] = useState<number>(0);
    const [ballId, setBallId] = useState<number>(0);

    useEffect(() => {
        if (courseContext.courses.length === 0) {
            generateCourse();
        }
    }, []);

    const generateCourse = () => {
        const target = {
            id: targetId + 1,
            xCoord: Math.floor(Math.random() * 500),
            yCoord: Math.floor(Math.random() * 800),
        };

        const ball = {
            id: ballId + 1,
            xCoord: Math.floor(Math.random() * 500),
            yCoord: Math.floor(Math.random() * 800),
        };

        const distance = Math.hypot(target.xCoord - ball.xCoord, target.yCoord - ball.yCoord);

        const newCourse: Course = {
            id: courseContext.courses.length + 1,
            EndDistance: distance,
            isFinished: false,
            target: target,
            ball: ball,
            usedShots: 0,
            allowedShots: 10
        };

        courseContext.addCourse(newCourse);

        setTargetId(prev => prev + 1);
        setBallId(prev => prev + 1);
    };

    return (
        <View>
            <Button name={"Next Target"} onPress={() => router.push("/nextTarget")} />
            <Button name={"Swing"} onPress={() => router.push("/swing")} />
            <Button name={"History"} onPress={() => router.push("/history")} />
        </View>
    );
}
