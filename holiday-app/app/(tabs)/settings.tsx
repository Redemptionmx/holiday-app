import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import {
  getRegion,
  saveRegion,
  getSchoolYear,
  saveSchoolYear,
  detectRegionFromLatitude,
  Region,
} from "../storage/settings";

const COLORS = {
  white: "#FFFFFF",
  blueLight: "#5AB3FF",
  blueLight2: "#8FD0FF",
  orange: "#FF7A00",
  orange2: "#FF9E42",
  textDark: "#22303A",
  textMuted: "#5E6B77",
  border: "#E5EEF5",
};

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
    const lat = 52.1; // Demo latitude
    const detected = detectRegionFromLatitude(lat);
    setRegion(detected);
  }

  const LeftControls = (
    <View style={styles.controls}>
      <LinearGradient
        colors={[COLORS.blueLight, COLORS.blueLight2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Instellingen</Text>
      </LinearGradient>

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

      <TouchableOpacity
        style={styles.gpsButtonWrap}
        onPress={detectRegion}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[COLORS.orange, COLORS.orange2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gpsButton}
        >
          <Text style={styles.gpsButtonText}>Bepaal regio van GPS</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const RightControls = (
    <View style={styles.controls}>
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

      <TouchableOpacity
        style={styles.saveButtonWrap}
        onPress={onSave}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[COLORS.blueLight, COLORS.blueLight2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Opslaan</Text>
        </LinearGradient>
      </TouchableOpacity>
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
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        {isLandscape ? (
          <>
            <View style={styles.left}>{LeftControls}</View>
            <View style={styles.right}>{RightControls}</View>
          </>
        ) : (
          <>
            {LeftControls}
            {RightControls}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pageBg: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent" },
  portrait: { padding: 16 },
  landscape: { flexDirection: "row", padding: 16, gap: 24 },
  left: { width: "50%", paddingRight: 12 },
  right: { width: "50%", paddingLeft: 12 },
  controls: { flex: 1 },

  headerGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.white,
  },

  label: { fontSize: 18, marginTop: 16, marginBottom: 8, color: COLORS.textDark },
  radioGroup: { marginBottom: 12 },
  radioOption: { marginVertical: 4 },
  radioText: { fontSize: 16, color: COLORS.textMuted },
  radioSelected: { fontSize: 16, fontWeight: "bold", color: COLORS.orange },

  gpsButtonWrap: { borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  gpsButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  gpsButtonText: { fontSize: 16, color: COLORS.white, fontWeight: "600" },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },

  saveButtonWrap: { borderRadius: 10, overflow: "hidden" },
  saveButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  saveButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 16 },
});
