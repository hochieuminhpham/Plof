import {DeviceMotion, DeviceMotionMeasurement} from 'expo-sensors'
import {EventSubscription, View, Text, StyleSheet, Alert, Animated} from "react-native";
import {useEffect, useState} from "react";
import React from "react"
import {useCourse} from "@/context/CourseContext";
import {useLocalSearchParams} from "expo-router";
import {Styles} from '@/style/style'
import {Compass} from "@/components/Compass";

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
        <Compass alpha={userData?.rotation?.alpha?.toFixed(2)!} relativeAngle={relativeAngle} targetAngle={targetAngle.toFixed(2)}/>
    );
}

