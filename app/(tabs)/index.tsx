// HomeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import GoogleFit, { Scopes } from "react-native-google-fit";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

/* ---------- Types ---------- */
type Metric = { label: string; value: number; suffix?: string };

/* ---------- Theme ---------- */
const COLORS = {
  stepsRing: "#2E7D32",
  stepsTrack: "#D7F2DA",
  heartRing: "#1F4AA8",
  heartTrack: "#D7E5FF",
  text: "#09101D",
  sub: "#4B5563",
  blueText: "#1F4AA8",
  greenText: "#2E7D32",
  card: "#FFFFFF",
  bg: "#FFFFFF",
  divider: "#E6E6E6",
  kpi: "#0A0A0A",
  kpiSub: "#64748B",
  goalTrack: "#E8F0FE",
};

/* ---------- Layout ---------- */
const RING_SIZE = 220;

/* ---------- Helpers ---------- */
const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const dateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

/* Map Google Fit activity codes */
const activityMap: Record<string, string> = {
  "7": "walking",
  "8": "running",
  "1": "biking",
  "72": "swimming",
  "9": "aerobics",
  "97": "strength_training",
  "4": "unknown",
};

/* ---------- Dual Ring ---------- */
function DualRing({ size, stroke, stepsPct, heartPct }: { size: number; stroke: number; stepsPct: number; heartPct: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const gap = 6;

  const rOuter = (size - stroke) / 2;
  const rInner = rOuter - (stroke + gap);
  const circOuter = 2 * Math.PI * rOuter;
  const circInner = 2 * Math.PI * rInner;

  const clamp = (v: number) => Math.max(0, Math.min(0.9999, isFinite(v) ? v : 0));
  const s = clamp(stepsPct);
  const h = clamp(heartPct);

  const sZero = s <= 1e-6;
  const hZero = h <= 1e-6;

  const stepsDashArray = sZero ? `0 ${circOuter}` : `${circOuter} ${circOuter}`;
  const heartDashArray = hZero ? `0 ${circInner}` : `${circInner} ${circInner}`;
  const stepsOffset = sZero ? 0 : circOuter * (1 - s);
  const heartOffset = hZero ? 0 : circInner * (1 - h);

  const stepsAngle = sZero ? 0 : 360 * s;
  const heartAngle = hZero ? 0 : 360 * h;

  const dotOuter = polarToCartesian(cx, cy, rOuter, stepsAngle);
  const dotInner = polarToCartesian(cx, cy, rInner, heartAngle);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={rOuter} stroke={COLORS.stepsTrack} strokeWidth={stroke} fill="none" />
      <Circle cx={cx} cy={cy} r={rInner} stroke={COLORS.heartTrack} strokeWidth={stroke} fill="none" />
      <G rotation="-90" origin={`${cx}, ${cy}`}>
        <Circle cx={cx} cy={cy} r={rOuter} stroke={COLORS.stepsRing} strokeWidth={stroke} strokeDasharray={stepsDashArray} strokeDashoffset={stepsOffset} strokeLinecap="round" fill="none" />
        <Circle cx={cx} cy={cy} r={rInner} stroke={COLORS.heartRing} strokeWidth={stroke} strokeDasharray={heartDashArray} strokeDashoffset={heartOffset} strokeLinecap="round" fill="none" />
      </G>
      {!sZero && <Circle cx={dotOuter.x} cy={dotOuter.y} r={3.5} fill={COLORS.stepsRing} />}
      {!hZero && <Circle cx={dotInner.x} cy={dotInner.y} r={3.5} fill={COLORS.heartRing} />}
    </Svg>
  );
}

/* ---------- Mini dual ring ---------- */
function MiniDualPct({ size = 28, stroke = 3, stepsPct = 0, heartPct = 0 }: { size?: number; stroke?: number; stepsPct?: number; heartPct?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const gap = 2;
  const rOuter = (size - stroke) / 2;
  const rInner = rOuter - (stroke + gap);
  const circOuter = 2 * Math.PI * rOuter;
  const circInner = 2 * Math.PI * rInner;

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const s = clamp(stepsPct);
  const h = clamp(heartPct);

  const sZero = s <= 1e-6;
  const hZero = h <= 1e-6;

  const stepsDashArray = sZero ? `0 ${circOuter}` : `${circOuter} ${circOuter}`;
  const heartDashArray = hZero ? `0 ${circInner}` : `${circInner} ${circInner}`;
  const stepsOffset = sZero ? 0 : circOuter * (1 - s);
  const heartOffset = hZero ? 0 : circInner * (1 - h);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={rOuter} stroke={COLORS.stepsTrack} strokeWidth={stroke} fill="none" />
      <Circle cx={cx} cy={cy} r={rInner} stroke={COLORS.heartTrack} strokeWidth={stroke} fill="none" />
      <G rotation="-90" origin={`${cx}, ${cy}`}>
        <Circle cx={cx} cy={cy} r={rOuter} stroke={COLORS.stepsRing} strokeWidth={stroke} strokeDasharray={stepsDashArray} strokeDashoffset={stepsOffset} strokeLinecap="round" fill="none" />
        <Circle cx={cx} cy={cy} r={rInner} stroke={COLORS.heartRing} strokeWidth={stroke} strokeDasharray={heartDashArray} strokeDashoffset={heartOffset} strokeLinecap="round" fill="none" />
      </G>
    </Svg>
  );
}

/* ---------- Screen ---------- */
export default function HomeScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [todayHeartPts, setTodayHeartPts] = useState(0);
  const [cal, setCalories] = useState(0);
  const [miles, setMiles] = useState(0);
  const [moveMinutes, setMoveMinutes] = useState(0);
  const [stepsPctByDay, setStepsPctByDay] = useState<number[]>(Array(7).fill(0));
  const [heartPctByDay, setHeartPctByDay] = useState<number[]>(Array(7).fill(0));

  const DAILY_STEPS_GOAL = 5000;
  const HEART_DAILY_TARGET = 30;
  const WEEKLY_HEART_TARGET = 150;

  const stepsPct = useMemo(() => Math.min(1, todaySteps / DAILY_STEPS_GOAL || 0), [todaySteps]);
  const heartPct = useMemo(() => Math.min(1, todayHeartPts / HEART_DAILY_TARGET || 0), [todayHeartPts]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const init = async () => {
      try {
        const res = await GoogleFit.authorize({
          scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_LOCATION_READ, Scopes.FITNESS_BODY_READ, Scopes.FITNESS_HEART_RATE_READ , Scopes.FITNESS_HEART_RATE_WRITE],
        });
        if (!res.success) return;

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - 6);

        const windowOpts : any = {
          startDate: startOfWeek.toISOString(),
          endDate: today.toISOString(),
          bucketUnit: "DAY",
          bucketInterval: 1,
        };

        const days: Date[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setHours(0, 0, 0, 0);
          d.setDate(today.getDate() - i);
          days.push(d);
        }

        /* Steps */
        const stepSamples = await GoogleFit.getDailyStepCountSamples(windowOpts);
        const disSample = await GoogleFit.getDailyDistanceSamples(windowOpts);
        const calories = await GoogleFit.getDailyCalorieSamples(windowOpts);
        const moveSamples = await GoogleFit.getMoveMinutes(windowOpts);
        const heartSample = await GoogleFit.getHeartRateSamples(windowOpts);
  console.log('heartSample',heartSample)
        const stepsByKey: Record<string, number> = {};
        stepSamples.forEach((src: any) => {
          src.steps?.forEach((s: any) => {
            const key = dateKey(new Date(s.date));
            stepsByKey[key] = (stepsByKey[key] || 0) + (s.value || 0);
          });
        });

        const todayKey = dateKey(today);
        setTodaySteps(stepsByKey[todayKey] ?? 0);

        const calByKey: Record<string, number> = {};
        calories.forEach((src: any) => {
          const key = dateKey(new Date(src.endDate));
          calByKey[key] = (calByKey[key] || 0) + (src.calorie || 0);
        });
        setCalories(Math.round(calByKey[todayKey] ?? 0));

        const distanceByKey: Record<string, number> = {};
        disSample.forEach((src: any) => {
          const key = dateKey(new Date(src.endDate));
          distanceByKey[key] = (distanceByKey[key] || 0) + (src.distance || 0);
        });
        setMiles(Number(((distanceByKey[todayKey] ?? 0) / 1609.34).toFixed(2)));

        const moveByKey: Record<string, number> = {};
        moveSamples.forEach((src: any) => {
          const key = dateKey(new Date(src.endDate));
          moveByKey[key] = (moveByKey[key] || 0) + (src.duration || 0);
        });
        console.log('moveByKey',moveByKey)
        setMoveMinutes(Math.round(moveByKey[todayKey] ?? 0));

        /* Daily progress */
        setStepsPctByDay(days.map((d) => Math.min(1, (stepsByKey[dateKey(d)] || 0) / DAILY_STEPS_GOAL)));
        setHeartPctByDay(days.map((d) => Math.min(1, (0) / HEART_DAILY_TARGET)));

        // TodayHeartPts = Move Minutes for ring
        setTodayHeartPts(Math.round(0));

      } catch (err) {
        console.log("Google Fit error:", err);
      }
    };

    init();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header ring */}
        <View style={styles.headerWrap}>
          <View style={{ width: RING_SIZE, height: RING_SIZE }}>
            <DualRing size={RING_SIZE} stroke={14} stepsPct={stepsPct} heartPct={heartPct} />
            <View style={styles.center}>
              <Text style={[styles.centerBig, { color: COLORS.blueText }]}>{todayHeartPts}</Text>
              <Text style={[styles.centerBigSmall, { color: COLORS.greenText }]}>{Intl.NumberFormat().format(todaySteps)}</Text>
            </View>
          </View>
        </View>

        {/* Labels */}
        <View style={styles.ringLabels}>
          <View style={styles.ringLabelItem}>
            <Ionicons name="heart" size={16} color={COLORS.blueText} />
            <Text style={[styles.ringLabelText, { color: COLORS.blueText }]}>Heart Pts</Text>
          </View>
          <View style={styles.ringLabelItem}>
            <Ionicons name="walk" size={16} color={COLORS.greenText} />
            <Text style={[styles.ringLabelText, { color: COLORS.greenText }]}>Steps</Text>
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{cal}</Text>
            <Text style={styles.kpiLabel}>Cal</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{miles}</Text>
            <Text style={styles.kpiLabel}>Mi</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{moveMinutes}</Text>
            <Text style={styles.kpiLabel}>Move Min</Text>
          </View>
        </View>

        {/* Daily goals */}
        <Card>
          <RowBetween>
            <Text style={styles.sectionTitle}>Your daily goals</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
          </RowBetween>
          <Text style={styles.sectionSub}>Last 7 days</Text>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.heartRing }]} />
              <Text style={[styles.legendText, { color: COLORS.blueText }]}>Heart</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.stepsRing }]} />
              <Text style={[styles.legendText, { color: COLORS.greenText }]}>Steps</Text>
            </View>
          </View>

          <View style={styles.weekDots}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <View key={i} style={styles.dotWrap}>
                <MiniDualPct stepsPct={stepsPctByDay[i] || 0} heartPct={heartPctByDay[i] || 0} />
                <Text style={styles.dotLabel}>{d}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Small UI bits ---------- */
function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
function RowBetween({ children }: { children: React.ReactNode }) {
  return <View style={styles.rowBetween}>{children}</View>;
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  headerWrap: { alignItems: "center", paddingTop: 16, paddingBottom: 8, backgroundColor: COLORS.bg },
  center: { position: "absolute", top: 0, left: 0, width: RING_SIZE, height: RING_SIZE, alignItems: "center", justifyContent: "center", gap: 8 },
  centerBig: { fontSize: 34, fontWeight: "800" },
  centerBigSmall: { fontSize: 28, fontWeight: "700" },
  ringLabels: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 8, marginBottom: 16 },
  ringLabelItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  ringLabelText: { fontSize: 14, fontWeight: "600" },
  kpiRow: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.divider },
  kpiItem: { alignItems: "center" },
  kpiValue: { fontSize: 22, fontWeight: "700", color: COLORS.kpi },
  kpiLabel: { fontSize: 14, color: COLORS.kpiSub, marginTop: 2 },
  card: { backgroundColor: COLORS.card, marginHorizontal: 12, marginTop: 14, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.divider },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  sectionSub: { fontSize: 13, color: COLORS.sub, marginTop: 2 },
  legendRow: { flexDirection: "row", gap: 16, marginTop: 12, marginBottom: 6, alignItems: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText
: { fontSize: 12, fontWeight: "600" },
  weekDots: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingHorizontal: 6 },
  dotWrap: { alignItems: "center", width: 36 },
  dotLabel: { marginTop: 6, fontSize: 12, color: COLORS.sub },
  weekProgress: { fontSize: 20, fontWeight: "700" },
  progressTrack: { height: 10, borderRadius: 6, backgroundColor: COLORS.goalTrack, overflow: "hidden", marginTop: 6 },
  progressFill: { height: "100%", borderRadius: 6 },
});
