import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getRegion, getSchoolYear, Region } from "../storage/settings";
import { fetchHolidays, Holiday } from "../services/holidays";

// Helper: parse YYYY-MM-DD as local date
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const COLORS = {
  white: "#FFFFFF",
  blueLight: "#5AB3FF",
  blueLight2: "#8FD0FF",
  orange: "#FF7A00",
  orange2: "#FF9E42",
  textDark: "#22303A",
  textMuted: "#5E6B77",
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
      <LinearGradient
        colors={[COLORS.blueLight, COLORS.blueLight2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Countdown</Text>
      </LinearGradient>

      <Text style={styles.region}>
        Regio: {region.charAt(0).toUpperCase() + region.slice(1)}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.blueLight} style={{ marginTop: 20 }} />
      ) : holiday && daysLeft !== null ? (
        <>
          <LinearGradient
            colors={[COLORS.orange, COLORS.orange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.countdownBox}
          >
            <Text style={styles.countdown}>Nog {daysLeft} dagen</Text>
          </LinearGradient>
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
    <LinearGradient
      colors={[COLORS.white, COLORS.blueLight2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.pageBg}
    >
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageBg: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent", padding: 16 },
  containerPortrait: { flexDirection: "column" },
  containerLandscape: { flexDirection: "row" },
  leftPanel: { width: "50%", paddingRight: 12 },
  rightPanel: { width: "50%", paddingLeft: 12 },
  block: { alignItems: "center", marginBottom: 24 },

  headerGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: COLORS.white },

  region: { fontSize: 16, color: COLORS.textMuted, marginBottom: 16 },

  countdownBox: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  countdown: { fontSize: 32, fontWeight: "bold", color: COLORS.white, textAlign: "center" },

  description: { fontSize: 18, color: COLORS.textDark, marginBottom: 12 },
  helper: { fontSize: 16, color: COLORS.textMuted },
  image: { width: 150, height: 150, marginTop: 12, borderRadius: 8 },
});
