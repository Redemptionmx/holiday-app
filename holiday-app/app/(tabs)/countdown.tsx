import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { getRegion, getSchoolYear, Region } from "../storage/settings";
import { fetchHolidays, Holiday } from "../services/holidays";

// Helper: parse YYYY-MM-DD as local date
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function CountdownScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [region, setRegion] = useState<Region>("midden");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedRegion = await getRegion();
        const savedYear = await getSchoolYear();
        const finalRegion = (savedRegion as Region) || "midden";
        const finalYear = savedYear || "2025-2026";

        setRegion(finalRegion);
        setSchoolYear(finalYear);

        const holidays = await fetchHolidays(finalYear, finalRegion);
        // Find the next upcoming Kerstvakantie
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const kerst = holidays.find(
          (h) => h.name === "Kerstvakantie" && parseLocalDate(h.startdate) >= today
        );

        if (kerst) {
          setHoliday(kerst);

          const start = parseLocalDate(kerst.startdate);
          let diff = Math.ceil(
            (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Clamp at 0 to avoid negatives
          if (diff < 0) diff = 0;
          setDaysLeft(diff);
        } else {
          setHoliday(null);
          setDaysLeft(null);
        }
      } catch (e) {
        console.error("Countdown load error:", e);
        setHoliday(null);
        setDaysLeft(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const Left = (
    <View style={styles.block}>
      <Text style={styles.title}>Countdown</Text>
      <Text style={styles.region}>
        Regio: {region.charAt(0).toUpperCase() + region.slice(1)}
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      ) : holiday && daysLeft !== null ? (
        <>
          <Text style={styles.countdown}>Nog {daysLeft} dagen</Text>
          <Text style={styles.description}>Tot Kerst Vakantie</Text>
          <Image
            source={{
              uri: "https://via.placeholder.com/150?text=Kerst+Afbeelding",
            }}
            style={styles.image}
          />
        </>
      ) : (
        <Text style={styles.description}>Geen Kerstvakantie gevonden</Text>
      )}
    </View>
  );

  const Right = (
    <View style={styles.block}>
      <Text style={styles.helper}>Tot de Kerstvakantie</Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        isLandscape ? styles.containerLandscape : styles.containerPortrait,
      ]}
    >
      {isLandscape ? (
        <>
          <View style={styles.leftPanel}>{Left}</View>
          <View style={styles.rightPanel}>{Right}</View>
        </>
      ) : (
        <>
          {Left}
          {Right}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  containerPortrait: { flexDirection: "column" },
  containerLandscape: { flexDirection: "row" },
  leftPanel: { width: "50%", paddingRight: 12 },
  rightPanel: { width: "50%", paddingLeft: 12 },
  block: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  region: { fontSize: 16, color: "#555", marginBottom: 16 },
  countdown: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 8,
  },
  description: { fontSize: 18, color: "#333", marginBottom: 12 },
  helper: { fontSize: 16, color: "#777" },
  image: { width: 150, height: 150, marginTop: 12, borderRadius: 8 },
});
