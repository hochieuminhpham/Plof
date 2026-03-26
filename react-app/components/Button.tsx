import { Text, StyleSheet, Pressable } from "react-native";

interface ButtonProps{
    name: string,
    onPress: () => void
}

export default function Button({name, onPress}:ButtonProps){
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
   button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#2D6A4F",
    margin: 10
   },
   buttonText: {
    color: "white"
   }
})