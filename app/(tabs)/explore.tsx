// CoachDashboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#E4554D",   // red
  secondary: "#4CAF50", // green
  background: "#fff",
  textDark: "#333",
  textLight: "#777",
  card: "#f8f8f8",

  ringOuter: "#2E7D32",  // dark green
  stepsTrack: "#D7F2DA", // light green
  heartRing: "#1F4AA8",  // blue
};

const CoachDashboard = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Greeting */}
        <Text style={styles.greeting}>👋 Welcome back, Fitner!</Text>
        <Text style={styles.subGreeting}>
          Here’s your personalized coaching plan
        </Text>

        {/* Goals Section */}
        <Text style={styles.sectionTitle}>Your Daily Goals</Text>
        <View style={styles.cardRow}>
          <GoalCard icon="walk" title="Steps" value="8,200 / 10,000" />
          <GoalCard icon="flame" title="Calories" value="1,850 / 2,200" />
        </View>
        <View style={styles.cardRow}>
          <GoalCard icon="bed" title="Sleep" value="6h / 8h" />
          <GoalCard icon="water" title="Hydration" value="1.5L / 2.5L" />
        </View>

        {/* Workouts Section */}
        <Text style={styles.sectionTitle}>Today’s Workouts</Text>
        <WorkoutCard
          title="Morning Yoga"
          time="15 min"
          icon="leaf"
          color={COLORS.ringOuter}
        />
        <WorkoutCard
          title="Cardio Blast"
          time="30 min"
          icon="bicycle"
          color={COLORS.heartRing}
        />
        <WorkoutCard
          title="Strength Training"
          time="40 min"
          icon="barbell"
          color={COLORS.secondary}
        />

        {/* Coach Tips */}
        <Text style={styles.sectionTitle}>Coach’s Tip</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Consistency is key! Even a short 10-min walk helps you stay active. 💪
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const GoalCard = ({ icon, title, value }: any) => (
  <View style={styles.goalCard}>
    <Ionicons name={icon} size={28} color={"#4f9dc6ff"} />
    <Text style={styles.goalTitle}>{title}</Text>
    <Text style={styles.goalValue}>{value}</Text>
  </View>
);

const WorkoutCard = ({ title, time, icon, color }: any) => (
  <TouchableOpacity style={[styles.workoutCard, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={28} color={color} />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.workoutTitle}>{title}</Text>
      <Text style={styles.workoutTime}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  greeting: { fontSize: 24, fontWeight: "bold", color: COLORS.textDark },
  subGreeting: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 20,
    marginBottom: 10,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  goalCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    margin: 5,
  },
  goalTitle: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  goalValue: { fontSize: 16, fontWeight: "bold", color: COLORS.textDark },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    borderLeftWidth: 5,
  },
  workoutTitle: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },
  workoutTime: { fontSize: 14, color: COLORS.textLight },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F2",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  tipText: { marginLeft: 10, fontSize: 14, color: COLORS.textDark, flex: 1 },
});

export default CoachDashboard;