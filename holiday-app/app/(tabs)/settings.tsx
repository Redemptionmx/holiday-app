import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getRegion,
  saveRegion,
  getSchoolYear,
  saveSchoolYear,
  detectRegionFromLatitude,
  Region,
} from "../storage/settings";

export default function SettingsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [region, setRegion] = useState<Region>("midden");
  const [schoolYear, setSchoolYear] = useState("2025-2026");

  useEffect(() => {
    (async () => {
      const savedRegion = await getRegion();
      const savedYear = await getSchoolYear();
      if (savedRegion) setRegion(savedRegion);
      if (savedYear) setSchoolYear(savedYear);
    })();
  }, []);

  async function onSave() {
    await saveRegion(region);
    await saveSchoolYear(schoolYear);
    alert("Instellingen opgeslagen!");
  }

  async function detectRegion() {
    // Example GPS detection (replace with real location logic if needed)
    const lat = 52.1; // Demo latitude
    const detected = detectRegionFromLatitude(lat);
    setRegion(detected);
  }

  const Controls = (
    <View style={styles.controls}>
      <Text style={styles.title}>Instellingen</Text>

      <Text style={styles.label}>Kies Regio:</Text>
      <View style={styles.radioGroup}>
        {(["noord", "midden", "zuid"] as Region[]).map((r) => (
          <TouchableOpacity
            key={r}
            style={styles.radioOption}
            onPress={() => setRegion(r)}
          >
            <Text style={region === r ? styles.radioSelected : styles.radioText}>
              Regio {r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.gpsButton} onPress={detectRegion}>
        <Text style={styles.gpsButtonText}>Bepaal regio van GPS</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Schooljaar:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={schoolYear}
          onValueChange={(value) => setSchoolYear(value)}
        >
          <Picker.Item label="2024-2025" value="2024-2025" />
          <Picker.Item label="2025-2026" value="2025-2026" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Opslaan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        isLandscape ? styles.landscape : styles.portrait,
      ]}
    >
      {Controls}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  portrait: { padding: 16 },
  landscape: { flexDirection: "row", padding: 16 },
  controls: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: { fontSize: 18, marginTop: 16, marginBottom: 8, color: "#333" },
  radioGroup: { marginBottom: 12 },
  radioOption: { marginVertical: 4 },
  radioText: { fontSize: 16, color: "#555" },
  radioSelected: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
  gpsButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: "center",
  },
  gpsButtonText: { fontSize: 16, color: "#333" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
