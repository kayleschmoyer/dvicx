import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Button, TextInput, PhotoUploader } from '../components';
import VinScanner from '../components/VinScanner';
import { useTheme } from '../hooks';

interface RouteParams {
  order: {
    estimateNo: number;
    firstName: string;
    lastName: string;
    carYear: string;
    make: string;
    model: string;
    license: string;
  };
}

export default function VehicleVerificationScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const order = (route.params as RouteParams).order;
  const { theme } = useTheme();
  
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelLevel, setFuelLevel] = useState('');
  const [exteriorPhoto, setExteriorPhoto] = useState<string>('');
  const [interiorPhoto, setInteriorPhoto] = useState<string>('');
  const [showVinScanner, setShowVinScanner] = useState(false);
  const [notes, setNotes] = useState('');

  const handleContinue = () => {
    navigation.navigate('Inspection', { 
      order: {
        ...order,
        vin: vin || '1HGBH41JXMN109186',
        mileage: parseInt(mileage) || 50000,
        fuelLevel: fuelLevel || '3/4',
        exteriorPhoto,
        interiorPhoto,
        preInspectionNotes: notes
      }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Vehicle Verification</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          {order.carYear} {order.make} {order.model}
        </Text>
        <Text style={[styles.customer, { color: theme.text }]}>
          {order.firstName} {order.lastName} • {order.license}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>VIN *</Text>
        <View style={styles.vinRow}>
          <TextInput
            placeholder="Enter or scan VIN"
            value={vin}
            onChangeText={setVin}
            style={styles.vinInput}
            maxLength={17}
          />
          <Button 
            title="Scan" 
            onPress={() => setShowVinScanner(true)}
            style={styles.scanButton}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Mileage *</Text>
        <TextInput
          placeholder="Current mileage"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Fuel Level *</Text>
        <View style={styles.fuelButtons}>
          {['1/4', '1/2', '3/4', 'Full'].map(level => (
            <Button
              key={level}
              title={level}
              onPress={() => setFuelLevel(level)}
              style={[
                styles.fuelButton,
                fuelLevel === level && styles.selectedFuelButton
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Photos</Text>
        <View style={styles.photoRow}>
          <View style={styles.photoSection}>
            <Text style={[styles.photoLabel, { color: theme.text }]}>Exterior</Text>
            <PhotoUploader
              value={exteriorPhoto}
              onChange={setExteriorPhoto}
            />
          </View>
          <View style={styles.photoSection}>
            <Text style={[styles.photoLabel, { color: theme.text }]}>Interior</Text>
            <PhotoUploader
              value={interiorPhoto}
              onChange={setInteriorPhoto}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Pre-Inspection Notes</Text>
        <TextInput
          placeholder="Any visible damage or concerns..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Skip & Start Inspection"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>

      <Modal visible={showVinScanner} animationType="slide">
        <VinScanner
          onVinScanned={setVin}
          onClose={() => setShowVinScanner(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  customer: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  vinRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vinInput: {
    flex: 1,
  },
  scanButton: {
    paddingHorizontal: 16,
  },
  fuelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fuelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  selectedFuelButton: {
    backgroundColor: '#007AFF',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  photoSection: {
    flex: 1,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    marginTop: 16,
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
  },
});