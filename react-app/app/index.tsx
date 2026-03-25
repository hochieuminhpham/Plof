import { Text, View } from "react-native";
import Button from "../components/Button";
import {useRouter} from 'expo-router';

export default function Index() {

    const router = useRouter();

    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Button name="Play" onPress={() => router.push("/play")}></Button>
        </View>
    );
}
