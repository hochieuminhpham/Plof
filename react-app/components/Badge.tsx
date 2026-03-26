import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCourse } from "@/context/CourseContext";
import { Compass } from "./Compass";
import { useState, useEffect } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { useLocalSearchParams } from "expo-router";

export default function Badge() {
  const { courses, calculateDistance, getCourseById } = useCourse();
  const { id } = useLocalSearchParams();
  const course = getCourseById(parseInt(id as string));
  const [userData, setUserData] = useState<DeviceMotionMeasurement>();
  const [targetAngle, setTargetAngle] = useState(
    Math.atan2(
      course.target.yCoord - course.ball.yCoord,
      course.target.xCoord - course.ball.xCoord,
    ),
  );
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
    <View style={styles.badge}>
      <Text>Target:</Text>
      <Text>{Math.floor(calculateDistance(courses[0].id))}</Text>
      <Pressable>
        <Compass
          alpha={userData?.rotation?.alpha?.toFixed(2)!}
          relativeAngle={relativeAngle}
          targetAngle={targetAngle.toFixed(2)}
          isOverlay={true}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: '#F0F9F4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    alignSelf: "flex-end",
    paddingHorizontal: 60,
    paddingVertical: 20,
    padding: 50,
    marginTop: 20,
    marginBottom: 60,
    color: "white"
  },
});
