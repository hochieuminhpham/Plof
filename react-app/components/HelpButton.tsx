import { Pressable, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HelpButton() {
    const [isPressed, setPressed] = useState(false);

    return (
        <View style={styles.container}>
            {/* Das Overlay */}
            {isPressed && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>The Arrow must show north</Text>
                </View>
            )}

            {/* Der Button (Pressable erlaubt die (pressed) => [] Syntax) */}
            <Pressable
                style={({ pressed }) => [
                    styles.FAB,
                    pressed && styles.pressed
                ]}
                onPress={() => setPressed(!isPressed)}
            >
                <Ionicons name="help" size={30} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 30,
        right: 30,
        alignItems: 'flex-end', // Richtet Overlay und Button rechts aus
    },
    FAB: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Schatten für Android
        shadowColor: '#000', // Schatten für iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }] // Kleiner Animationseffekt
    },
    overlay: {
        marginBottom: 10, // Abstand zum Button
        padding: 15,
        width: 150,
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    overlayText: {
        color: "black",
        textAlign: "center"
    }
});
