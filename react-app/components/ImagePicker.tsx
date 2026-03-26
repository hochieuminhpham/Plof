import React from 'react';
import { Alert, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerProps{
    imageUri?: string,
    onImageSelected: (image: string) => void
}

export default function ImagePickerComponent({imageUri, onImageSelected}:ImagePickerProps){


    const takeOnCamera = async () => {
        try {
            const permissionResponse = await ImagePicker.requestCameraPermissionsAsync();

            if (!permissionResponse.granted){
                Alert.alert("YOU HAVE NO PERMISSION", "lol");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                quality: 1,
                allowsEditing: true,
                mediaTypes: "images",
                aspect: [16, 9]
            })

            if (!result.canceled){
                onImageSelected(result.assets[0].uri)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const getOnCameraRoll = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted){
                Alert.alert("YOU HAVE NO PERMISSION", "lol");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                quality: 1,
                allowsEditing: true,
                aspect: [16, 9]
            })

            if (!result.canceled){
                onImageSelected(result.assets[0].uri)
            }

        } catch (e) {

        }
    }

    const handlePress = () => {
        const buttons  = [
            {
                text: "WITH CAMERA",
                onPress: takeOnCamera
            },
            {
                text: "ON CAMERAROLL",
                onPress: getOnCameraRoll
            },
            {text: "cancel", onPress: () => console.log("Abgebrochen"), style: "cancel"}
        ]

        // Alert.alert("You want to take photo", "answer.", buttons);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.image}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Bild hinzufügen</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    placeholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#999",
        fontSize: 14,
        textAlign: "center",
    },
});