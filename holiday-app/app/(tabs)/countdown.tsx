import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { getRegion } from "../storage/settings";
import { fetchHolidays } from "../services/holidays";

// Helper: parse YYYY-MM-DD as local date
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // months are 0-based
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
        const kerst = holidays.find((h) => h.name === "Kerstvakantie");

        if (kerst) {
          setHoliday(kerst);

          const today = new Date();
          today.setHours(0, 0, 0, 0); // normalize to midnight
          const start = parseLocalDate(kerst.startdate);

          const diff = Math.ceil(
            (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
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
      <Text style={styles.region}>Regio: {region.toUpperCase()}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : holiday && daysLeft !== null ? (
        <>
          <Text style={styles.countdown}>Nog {daysLeft} dagen</Text>
          <Text style={styles.description}>Tot Kerstvakantie</Text>
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
  description: { fontSize: 18, color: "#333" },
  helper: { fontSize: 16, color: "#777" },
});
