import { View, Text, StyleSheet } from "react-native";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SwingPowerBar from "@/components/SwingBar";
import { useEffect, useState, useRef } from "react";
import { DeviceMotion } from "expo-sensors";

export default function Swing() {
  const [power, setPower] = useState(0);
  const [tracking, setTracking] = useState(false);
  const counter = useRef(0);
  const vectorValues = useRef<{x: number, z: number, y: number}[]>([]);
  const lastTimestamp = useRef<number | null>(null);
  const speed = useRef(0);

  const baselineGravity = useRef<{ x: number; y: number; z: number } | null>(null);

  function median(axis: "x" | "y" | "z"){
    const sorted = [...vectorValues.current].map(v => v[axis]).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if(sorted.length % 2 === 0){
      return (sorted[middle - 1] + sorted[middle] / 2)
    }else {
      return sorted[middle]
    }
  }

  useEffect(() => {
    // Set update interval explicitly — some devices won't fire without this
    DeviceMotion.setUpdateInterval(10);

    const subscription = DeviceMotion.addListener((motion) => {
      if(counter.current < 10){
        const a = motion.accelerationIncludingGravity ?? null;
        if(!a){
          return;
        }
        vectorValues.current.push(a);
        counter.current++;
        return;
      }
      counter.current = 0;
      if (!tracking) return;

      // Try motion.gravity first, fall back to accelerationIncludingGravity
      // (accelerationIncludingGravity includes gravity component, which IS the
      // gravity vector when the phone is still — good enough for tilt detection)
      const g: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0}
      g.x = median('x');
      g.y = median('y');
      g.z = median('z');

      if (!baselineGravity.current) {
        baselineGravity.current = { x: g.x, y: g.y, z: g.z };
        return;
      }

      const base = baselineGravity.current;

      // Magnitude of each vector (should be ~9.8 but let's not assume)
      const magG = Math.sqrt(g.x ** 2 + g.y ** 2 + g.z ** 2);
      const magBase = Math.sqrt(base.x ** 2 + base.y ** 2 + base.z ** 2);

      if (magG === 0 || magBase === 0) return;

      // Dot product of the two unit vectors → cosine of angle between them
      const dot =  (g.x * base.x + g.y * base.y + g.z * base.z) / (magG * magBase);

      const clampedDot = Math.max(-1, Math.min(1, dot));
      const angleRad = Math.acos(clampedDot);
      const angleDeg = (angleRad * 180) / Math.PI;

      const maxAngle = 90;
      const normalized = Math.min(angleDeg / maxAngle, 1);
      setPower(normalized * 100);
    });

    return () => subscription.remove();
  }, [tracking]);

  function startTracking() {
    baselineGravity.current = null;
    setPower(0);
    speed.current = 0;
    lastTimestamp.current = null;
    setTracking(true);
  }

  return (
    <View>
      <Badge />
      <View style={styles.container}>
        <Button onPress={startTracking} name="Start Swing" />
        <Text style={styles.infoText}>Swing forward, if you want to shoot</Text>
      </View>
      <SwingPowerBar value={power} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
  },
  infoText: {
    fontStyle: "italic",
  },
  debugText: {
    fontSize: 10,
    color: "gray",
    marginTop: 8,
  },
});