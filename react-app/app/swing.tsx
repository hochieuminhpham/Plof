import { View, Text, StyleSheet } from "react-native";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SwingPowerBar from "@/components/SwingBar";
import { useEffect, useState, useRef } from "react";
import { DeviceMotion } from "expo-sensors";
import HelpButton from "@/components/HelpButton";

// Swing phases:
//   "idle"       → waiting for user to press Start
//   "baseline"   → capturing resting gyro + accel (first 10 ticks ~500ms)
//   "backswing"  → phone rotating back; power bar rises with cumulative rotation
//   "downswing"  → phone accelerating forward; tracking peak linear speed
//   "done"       → shot complete, showing final hit speed
type Phase = "idle" | "baseline" | "backswing" | "downswing" | "done";

// ── Tuning constants ──────────────────────────────────────────────────────────
const BASELINE_SAMPLES   = 10;    // ~500 ms of still samples
const BACKSWING_THRESHOLD = 0.08; // rad/s — ignore tiny wobbles
const BACKSWING_ALPHA_UP  = 0.4;  // smoothing when rising
const BACKSWING_ALPHA_DN  = 0.15; // smoothing when falling (slower descent feels better)
const DOWNSWING_TRIGGER_ROTATION = 0.15; // rad/s toward address to switch phase
const DOWNSWING_TRIGGER_POWER    = 8;    // power bar % — must have gone back at least this far
const MIN_DOWNSWING_MS   = 180;   // ignore sub-threshold readings for at least this long
const DONE_LINMAG_THRESH = 1.2;   // m/s² — below this counts as "settling"
const DONE_SETTLE_COUNT  = 5;     // need this many consecutive quiet ticks to end
const DONE_PEAK_MIN      = 3.0;   // peak must have reached this to count as a real swing
const ROTATION_SCALE     = 2.8;   // rad/s at full swing → normalise to 1.0 (tune to taste)
// ─────────────────────────────────────────────────────────────────────────────

export default function Swing() {
  const [power, setPower]     = useState(0);
  const [phase, setPhase]     = useState<Phase>("idle");
  const [hitSpeed, setHitSpeed] = useState<number | null>(null);

  // Sensor baseline
  const baselineGyro = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const baselineSamples = useRef<{ alpha: number; beta: number; gamma: number }[]>([]);

  // Running state — all in refs so the listener closure is stable
  const smoothedPower     = useRef(0);
  const peakSpeed         = useRef(0);
  const downswingStart    = useRef(0);   // Date.now() when downswing began
  const settleCount       = useRef(0);   // consecutive ticks below DONE_LINMAG_THRESH
  const phaseRef          = useRef<Phase>("idle");

  function setPhaseSync(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50); // 20 Hz

    const subscription = DeviceMotion.addListener((motion) => {
      if (phaseRef.current === "idle" || phaseRef.current === "done") return;

      const rot = motion.rotation;       // { alpha, beta, gamma } in radians/s via expo
      const lin = motion.acceleration;   // linear, gravity removed

      if (!rot) return;

      // ── BASELINE ─────────────────────────────────────────────────────────
      if (phaseRef.current === "baseline") {
        baselineSamples.current.push({ alpha: rot.alpha, beta: rot.beta, gamma: rot.gamma });
        if (baselineSamples.current.length < BASELINE_SAMPLES) return;

        const n = baselineSamples.current.length;
        const avg = baselineSamples.current.reduce(
          (acc, v) => ({ alpha: acc.alpha + v.alpha / n, beta: acc.beta + v.beta / n, gamma: acc.gamma + v.gamma / n }),
          { alpha: 0, beta: 0, gamma: 0 }
        );
        baselineGyro.current = avg;
        smoothedPower.current = 0;
        peakSpeed.current = 0;
        settleCount.current = 0;
        setPhaseSync("backswing");
        return;
      }

      // ── Rotation magnitude relative to resting baseline ──────────────────
      // Using all three axes so it works regardless of phone orientation/grip.
      const dAlpha = rot.alpha - baselineGyro.current.alpha;
      const dBeta  = rot.beta  - baselineGyro.current.beta;
      const dGamma = rot.gamma - baselineGyro.current.gamma;
      const rotMag = Math.sqrt(dAlpha ** 2 + dBeta ** 2 + dGamma ** 2);

      // ── BACKSWING ─────────────────────────────────────────────────────────
      if (phaseRef.current === "backswing") {
        // Only accumulate rotation that exceeds noise floor
        const activeRot = rotMag > BACKSWING_THRESHOLD ? rotMag : 0;
        const target = Math.min((activeRot / ROTATION_SCALE) * 100, 100);

        const alpha = target > smoothedPower.current ? BACKSWING_ALPHA_UP : BACKSWING_ALPHA_DN;
        smoothedPower.current = smoothedPower.current * (1 - alpha) + target * alpha;
        setPower(Math.round(smoothedPower.current));

        // Downswing trigger: rotation reverses AND we've gone back enough
        // We detect reversal by checking linear acceleration magnitude — the
        // downswing produces a sharp acceleration burst that backswing doesn't.
        if (lin && smoothedPower.current >= DOWNSWING_TRIGGER_POWER) {
          const linMag = Math.sqrt((lin.x ?? 0) ** 2 + (lin.y ?? 0) ** 2 + (lin.z ?? 0) ** 2);
          if (linMag > 4.0) {
            // Strong burst — start downswing immediately
            peakSpeed.current = linMag;
            settleCount.current = 0;
            downswingStart.current = Date.now();
            setPhaseSync("downswing");
          }
        }
        return;
      }

      // ── DOWNSWING ─────────────────────────────────────────────────────────
      if (phaseRef.current === "downswing") {
        if (!lin) return;

        const linMag = Math.sqrt((lin.x ?? 0) ** 2 + (lin.y ?? 0) ** 2 + (lin.z ?? 0) ** 2);
        if (linMag > peakSpeed.current) peakSpeed.current = linMag;

        const elapsed = Date.now() - downswingStart.current;

        // Require minimum downswing time before we allow completion
        if (elapsed < MIN_DOWNSWING_MS) return;

        // Count consecutive quiet ticks to detect end of follow-through
        if (linMag < DONE_LINMAG_THRESH) {
          settleCount.current += 1;
        } else {
          settleCount.current = 0;
        }

        if (settleCount.current >= DONE_SETTLE_COUNT && peakSpeed.current >= DONE_PEAK_MIN) {
          setHitSpeed(Math.round(peakSpeed.current * 10) / 10);
          setPower(0);
          smoothedPower.current = 0;
          setPhaseSync("done");
        }
        return;
      }
    });

    return () => subscription.remove();
  }, []);

  function startTracking() {
    baselineGyro.current = { alpha: 0, beta: 0, gamma: 0 };
    baselineSamples.current = [];
    smoothedPower.current = 0;
    peakSpeed.current = 0;
    settleCount.current = 0;
    downswingStart.current = 0;
    setHitSpeed(null);
    setPower(0);
    setPhaseSync("baseline");
  }

  const phaseLabel: Record<Phase, string> = {
    idle:       "Press Start to begin",
    baseline:   "Hold still…",
    backswing:  "Swing back ↑",
    downswing:  "Swinging…",
    done:       "Shot complete!",
  };

  return (
      <View>
        <View>
          <Badge />
          <View style={styles.container}>
            <Button onPress={startTracking} name="Start Swing" />
            <Text style={styles.phaseText}>{phaseLabel[phase]}</Text>
            <Text style={styles.infoText}>
              {phase === "done" && hitSpeed !== null
                ? `Hit speed: ${hitSpeed} m/s²`
                : "Swing forward to shoot"}
            </Text>
          </View>
          <SwingPowerBar value={power} />
        </View>
        <HelpButton />
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
  },
  phaseText: {
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontStyle: "italic",
  },
});