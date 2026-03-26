import { View, Text, StyleSheet } from "react-native";

interface SwingPowerBarProps{
    value: number,
}

export default function SwingPowerBar({value}: SwingPowerBarProps) {
  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  const normalizedValue = clamp(value, 0, 100);

  return (
    <View style={styles.barContainer}>
      <View style={styles.barWrapper}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${normalizedValue}%`,
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.powerValue}>{Math.round(normalizedValue)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginRight: 12,
    marginLeft: 12,
  },
  barWrapper: {
    flex: 1,
    height: 24,
    justifyContent: "center",
  },
  barBackground: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  barFill: {
    position: "absolute",
    height: "100%",
    borderRadius: 10,
    backgroundColor: 'purple'
  },
  powerValue: {
    width: 30,
    textAlign: "right",
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
})