import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Badge(){
    return (
        <View style={styles.badge}>
            <Text>Target</Text>
            <Text>2m</Text>
            <Pressable></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    badge: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'green',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 20,
        alignSelf: 'flex-end',
        paddingHorizontal: 60,
        paddingVertical: 20,
        marginTop: 20,
    }
})