import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { getRegion, saveRegion, getSchoolYear, saveSchoolYear, Region } from '../../storage/settings';

export default function SettingsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [region, setRegion] = useState<Region>('midden');
  const [schoolYear, setSchoolYear] = useState('2025-2026');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const savedRegion = await getRegion();
      const savedYear = await getSchoolYear();
      if (savedRegion) setRegion(savedRegion as Region);
      if (savedYear) setSchoolYear(savedYear);
    })();
  }, []);

  async function onRegionChange(value: Region) {
    setRegion(value);
    await saveRegion(value);
    setSaved(false);
  }

  async function onYearChange(value: string) {
    setSchoolYear(value);
    await saveSchoolYear(value);
    setSaved(false);
  }

  async function detectRegionByGPS() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Locatie geweigerd', 'Sta locatie toe om regio automatisch te bepalen.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;

      let detected: Region = 'midden';
      if (lat >= 52.7) detected = 'noord';
      else if (lat < 51.9) detected = 'zuid';
      else detected = 'midden';

      setRegion(detected);
      await saveRegion(detected);
      Alert.alert('Regio ingesteld', `Automatisch gedetecteerd: ${detected.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      Alert.alert('Fout', 'Kon regio niet bepalen via GPS.');
    }
  }

  async function onSave() {
    await saveRegion(region);
    await saveSchoolYear(schoolYear);
    setSaved(true);
  }

  const Left = (
    <View style={styles.section}>
      <Text style={styles.titleSection}>Kies Regio</Text>
      <TouchableOpacity style={styles.radioOption} onPress={() => onRegionChange('noord')}>
        <Text style={region === 'noord' ? styles.radioSelected : styles.radioText}>
          {region === 'noord' ? '●' : '○'} Regio Noord
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.radioOption} onPress={() => onRegionChange('midden')}>
        <Text style={region === 'midden' ? styles.radioSelected : styles.radioText}>
          {region === 'midden' ? '●' : '○'} Regio Midden
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.radioOption} onPress={() => onRegionChange('zuid')}>
        <Text style={region === 'zuid' ? styles.radioSelected : styles.radioText}>
          {region === 'zuid' ? '●' : '○'} Regio Zuid
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gpsButton} onPress={detectRegionByGPS}>
        <Text style={styles.gpsButtonText}>Bepaal regio via GPS</Text>
      </TouchableOpacity>
    </View>
  );

  const Right = (
    <View style={styles.section}>
      <Text style={styles.titleSection}>Schooljaar</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={schoolYear} onValueChange={onYearChange}>
          <Picker.Item label="2024-2025" value="2024-2025" />
          <Picker.Item label="2025-2026" value="2025-2026" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Opslaan</Text>
      </TouchableOpacity>
      {saved && <Text style={styles.savedText}>Instellingen opgeslagen</Text>}
    </View>
  );

  return (
    <View style={[styles.container, isLandscape ? styles.containerLandscape : styles.containerPortrait]}>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  containerPortrait: { flexDirection: 'column' },
  containerLandscape: { flexDirection: 'row' },
  leftPanel: { width: '50%', paddingRight: 12 },
  rightPanel: { width: '50%', paddingLeft: 12 },
  section: { marginBottom: 24 },
  titleSection: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  radioOption: { marginVertical: 6 },
  radioText: { fontSize: 16, color: '#555' },
  radioSelected: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  gpsButton: { marginTop: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  gpsButtonText: { color: '#333', fontSize: 16 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden', marginBottom: 16 },
  saveButton: { backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  savedText: { marginTop: 10, textAlign: 'center', color: '#28a745' },
});
