import { Text, StyleSheet, Pressable } from "react-native";
export default function Button({name}){
    return (
        <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
   button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "blue",
   },
   buttonText: {
    color: "white"
   }
})