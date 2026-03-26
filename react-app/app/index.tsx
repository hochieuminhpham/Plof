import { Text, View } from "react-native";
import Button from "../components/Button";
import {useRouter} from 'expo-router';
import ImagePickerComponent from "@/components/ImagePicker";
import {useCourse} from "@/context/CourseContext";

export default function Index() {

    const router = useRouter();
    const {setImage, image} = useCourse()

    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <ImagePickerComponent onImageSelected={setImage} imageUri={image} />
            <Button name="Play" onPress={() => router.push("/play")}></Button>
        </View>
    );
}
