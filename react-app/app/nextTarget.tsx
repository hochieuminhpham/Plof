import {DeviceMotion, DeviceMotionMeasurement} from 'expo-sensors'
import {EventSubscription, View, Text, StyleSheet, Alert, Animated} from "react-native";
import {useEffect, useState} from "react";
import React from "react"
import {useCourse} from "@/context/CourseContext";
import {useLocalSearchParams} from "expo-router";

export default function NextTarget(){
    const courseContext = useCourse();
    const {id} = useLocalSearchParams();
    const course = courseContext.getCourseById(parseInt(id as string));
    const [userData, setUserData] = useState<DeviceMotionMeasurement>();
    const [targetAngle, setTargetAngle] = useState(Math.atan2(course.target.yCoord - course.ball.yCoord, course.target.xCoord - course.ball.xCoord));
    const [relativeAngle, setRelativeAngle] = useState(0);

    const checkAvailibility = async () => {
        const response = await DeviceMotion.isAvailableAsync();
        setAvailibility(response);
    }

    const checkPermission = async () => {
        const response = await DeviceMotion.getPermissionsAsync();
        setPermission(response.granted);
    }

    const [isAvailable, setAvailibility] = useState(false);
    const [hasPermission, setPermission] = useState(false);

    useEffect(() => {
        checkAvailibility();
    }, [])

    useEffect(() => {
        checkAvailibility()
        checkPermission()

        DeviceMotion.setUpdateInterval(16);

        const sub = DeviceMotion.addListener((data) => {
            setUserData(data)
        })

        return () => sub.remove();

        }, [])

    useEffect(() => {
        if (userData?.rotation) {
            // Berechne die Differenz
            let diff = targetAngle - userData.rotation.alpha;

            // Normalisierung: Hält den Winkel immer im Bereich -PI bis PI
            // Verhindert das "Springen" des Pfeils bei der 360°-Wende
            while (diff < -Math.PI) diff += 2 * Math.PI;
            while (diff > Math.PI) diff -= 2 * Math.PI;

            setRelativeAngle(diff);
        }
    }, [userData, targetAngle]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Alpha: {userData?.rotation?.alpha?.toFixed(2)}</Text>

            {/* Der Kompass-Container */}
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.arrow,
                        { transform: [{ rotate: `${relativeAngle}rad` }] }
                    ]}
                >
                    <View style={styles.arrowHead} />
                </Animated.View>
            </View>

            <Text>Ziel-Winkel: {targetAngle.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    arrow: {
        width: 2,
        height: 60,
        backgroundColor: 'red',
        alignItems: 'center',
    },
    arrowHead: {
        width: 10,
        height: 10,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: 'red',
        transform: [{ rotate: '-45deg' }],
        marginTop: -5,
    }
});