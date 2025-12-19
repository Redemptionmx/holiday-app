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
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import {
  getRegion,
  getSchoolYear,
  saveSchoolYear,
  Region,
} from "../storage/settings";
import { fetchHolidays, Holiday } from "../services/holidays";

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
      <Text style={styles.title}>Deltion Holiday App</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Regio:</Text>
        <Text style={styles.value}>Regio {region.charAt(0).toUpperCase() + region.slice(1)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Schooljaar:</Text>
        <TouchableOpacity
          style={styles.yearButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.yearText}>{schoolYear}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HolidayList = (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      ) : holidays.length === 0 ? (
        <Text style={styles.noHolidays}>Geen vakanties gevonden</Text>
      ) : (
        <FlatList
          data={holidays}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDates}>
                {item.startdate} t/m {item.enddate}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </>
  );

  return (
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
              style={styles.closeButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.closeButtonText}>Sluiten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  portrait: { padding: 16 },
  landscape: { flexDirection: "row" },
  left: { width: "35%", padding: 16, borderRightWidth: 1, borderRightColor: "#ddd" },
  right: { width: "65%", padding: 16 },
  controls: { width: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  label: { fontSize: 16, color: "#555" },
  value: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
  yearButton: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#f9f9f9" },
  yearText: { fontSize: 16, color: "#333" },
  card: { backgroundColor: "#f2f2f2", padding: 12, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: "#333" },
  cardDates: { fontSize: 16, color: "#555" },
  noHolidays: { textAlign: "center", marginTop: 20, color: "#555" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "#fff", borderRadius: 8, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, marginBottom: 10 },
  pickerWrapper: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, marginBottom: 16, backgroundColor: "#fff" },
  closeButton: { backgroundColor: "#007bff", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
