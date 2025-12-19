import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import {
  getRegion,
  getSchoolYear,
  saveSchoolYear,
  Region,
} from "../storage/settings";
import { fetchHolidays, Holiday } from "../services/holidays";

const COLORS = {
  white: "#FFFFFF",
  blueLight: "#5AB3FF",
  blueLight2: "#8FD0FF",
  orange: "#FF7A00",
  orange2: "#FF9E42",
  textDark: "#22303A",
  textMuted: "#5E6B77",
  border: "#E5EEF5",
  cardBg: "#F7FAFD",
};

export default function OverviewScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [region, setRegion] = useState<Region>("midden");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSettingsAndData();
    }, [])
  );

  async function loadSettingsAndData() {
    try {
      setLoading(true);
      const savedRegion = await getRegion();
      const savedYear = await getSchoolYear();
      const finalRegion = (savedRegion as Region) || "midden";
      const finalYear = savedYear || "2025-2026";
      setRegion(finalRegion);
      setSchoolYear(finalYear);
      const data = await fetchHolidays(finalYear, finalRegion);
      setHolidays(data);
    } catch (e) {
      console.error("Overview load error:", e);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }

  async function onYearChange(value: string) {
    try {
      setSchoolYear(value);
      await saveSchoolYear(value);
      setPickerVisible(false);
      setLoading(true);
      const data = await fetchHolidays(value, region);
      setHolidays(data);
    } catch (e) {
      console.error("Year change error:", e);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }

  const Controls = (
    <View style={styles.controls}>
      <LinearGradient
        colors={[COLORS.blueLight, COLORS.blueLight2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Deltion Holiday App</Text>
      </LinearGradient>

      <View style={styles.infoRow}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Regio</Text>
          <Text style={styles.value}>
            Regio {region.charAt(0).toUpperCase() + region.slice(1)}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Schooljaar</Text>
          <TouchableOpacity
            style={styles.yearButtonWrap}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.orange, COLORS.orange2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.yearButton}
            >
              <Text style={styles.yearText}>{schoolYear}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const HolidayList = (
    <>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.blueLight} style={{ marginTop: 20 }} />
      ) : holidays.length === 0 ? (
        <Text style={styles.noHolidays}>Geen vakanties gevonden</Text>
      ) : (
        <FlatList
          data={holidays}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <LinearGradient
              colors={[COLORS.cardBg, COLORS.white]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDates}>
                {item.startdate} t/m {item.enddate}
              </Text>
            </LinearGradient>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </>
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
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        {isLandscape ? (
          <>
            <View style={styles.left}>{Controls}</View>
            <View style={styles.right}>{HolidayList}</View>
          </>
        ) : (
          <>
            {Controls}
            {HolidayList}
          </>
        )}
      </View>

      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecteer schooljaar</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={schoolYear}
                onValueChange={(value) => onYearChange(value)}
              >
                <Picker.Item label="2024-2025" value="2024-2025" />
                <Picker.Item label="2025-2026" value="2025-2026" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.closeButtonWrap}
              onPress={() => setPickerVisible(false)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.orange, COLORS.orange2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Sluiten</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageBg: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent" },
  portrait: { padding: 16 },
  landscape: { flexDirection: "row" },
  left: {
    width: "35%",
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  right: { width: "65%", padding: 16 },

  // Header gradient
  headerGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  controls: { width: "100%" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  infoBlock: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 6 },
  value: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },

  // Year button
  yearButtonWrap: { borderRadius: 10, overflow: "hidden" },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  yearText: { fontSize: 16, fontWeight: "700", color: COLORS.white },

  // Cards
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textDark, marginBottom: 4 },
  cardDates: { fontSize: 15, color: COLORS.textMuted },

  // Empty state
  noHolidays: { textAlign: "center", marginTop: 20, color: COLORS.textMuted },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  closeButtonWrap: { borderRadius: 10, overflow: "hidden" },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});

