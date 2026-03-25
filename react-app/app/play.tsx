import {View, Text, FlatList, Alert} from "react-native"
import Button from "@/components/Button";
import {useCourse} from "@/context/CourseContext";
import {useState, useEffect} from "react";
import {useRouter} from "expo-router";
import React from "react"

const router = useRouter();

export default function Play() {
    const courseContext = useCourse();

    return (
        <View>
            <Button name={"Next Target"} onPress={() => router.push(`/nextTarget?id=${encodeURIComponent(courseContext.courses[courseContext.courses.length-1].id!)}`)} />
            <Button name={"Swing"} onPress={() => router.push("/swing")} />
            <Button name={"History"} onPress={() => router.push("/history")} />
        </View>
    );
}
