import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components';
import { useTheme } from '../hooks';
import { clearSyncedData } from '../utils/offlineStorage';

const SETTINGS_KEYS = {
  AUTO_SYNC: 'auto_sync_enabled',
  PHOTO_QUALITY: 'photo_quality',
  MEASUREMENT_UNITS: 'measurement_units',
  QUICK_ACTIONS: 'quick_actions_enabled',
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [autoSync, setAutoSync] = useState(true);
  const [photoQuality, setPhotoQuality] = useState('medium');
  const [measurementUnits, setMeasurementUnits] = useState('imperial');
  const [quickActions, setQuickActions] = useState(true);

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.AUTO_SYNC),
        AsyncStorage.getItem(SETTINGS_KEYS.PHOTO_QUALITY),
        AsyncStorage.getItem(SETTINGS_KEYS.MEASUREMENT_UNITS),
        AsyncStorage.getItem(SETTINGS_KEYS.QUICK_ACTIONS),
      ]);

      if (settings[0] !== null) setAutoSync(JSON.parse(settings[0]));
      if (settings[1]) setPhotoQuality(settings[1]);
      if (settings[2]) setMeasurementUnits(settings[2]);
      if (settings[3] !== null) setQuickActions(JSON.parse(settings[3]));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Offline Data',
      'This will remove all synced inspection data from your device. Unsynced data will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearSyncedData();
            Alert.alert('Success', 'Offline data cleared');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sync & Data</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Auto Sync</Text>
            <Text style={[styles.settingDesc, { color: theme.text }]}>
              Automatically sync when connected to internet
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={(value) => {
              setAutoSync(value);
              saveSetting(SETTINGS_KEYS.AUTO_SYNC, value);
            }}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Quick Actions</Text>
            <Text style={[styles.settingDesc, { color: theme.text }]}>
              Show quick action buttons for faster inspections
            </Text>
          </View>
          <Switch
            value={quickActions}
            onValueChange={(value) => {
              setQuickActions(value);
              saveSetting(SETTINGS_KEYS.QUICK_ACTIONS, value);
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Photo Settings</Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Photo Quality</Text>
          <View style={styles.buttonGroup}>
            {['low', 'medium', 'high'].map(quality => (
              <Button
                key={quality}
                title={quality.charAt(0).toUpperCase() + quality.slice(1)}
                onPress={() => {
                  setPhotoQuality(quality);
                  saveSetting(SETTINGS_KEYS.PHOTO_QUALITY, quality);
                }}
                style={[
                  styles.qualityButton,
                  photoQuality === quality && styles.selectedButton
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Measurements</Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Units</Text>
          <View style={styles.buttonGroup}>
            {['imperial', 'metric'].map(unit => (
              <Button
                key={unit}
                title={unit === 'imperial' ? 'Imperial (in, psi)' : 'Metric (mm, kPa)'}
                onPress={() => {
                  setMeasurementUnits(unit);
                  saveSetting(SETTINGS_KEYS.MEASUREMENT_UNITS, unit);
                }}
                style={[
                  styles.unitButton,
                  measurementUnits === unit && styles.selectedButton
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
        
        <Button
          title="Clear Offline Data"
          onPress={handleClearData}
          style={styles.clearButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  qualityButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
});