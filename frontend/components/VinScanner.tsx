import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from './Button';
import { useTheme } from '../hooks';

interface Props {
  onVinScanned: (vin: string) => void;
  onClose: () => void;
}

export default function VinScanner({ onVinScanned, onClose }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setHasPermission(true);
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    
    if (data.length === 17) {
      onVinScanned(data);
      onClose();
    } else {
      Alert.alert('Invalid VIN', 'VIN must be 17 characters', [
        { text: 'Try Again', onPress: () => setScanned(false) }
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Camera Scanner Disabled for Testing
        </Text>
        <Button 
          title="Enter Test VIN" 
          onPress={() => {
            onVinScanned('1HGBH41JXMN109186');
            onClose();
          }} 
        />
      </View>
      <View style={styles.overlay}>
        <Text style={[styles.instruction, { color: theme.text }]}>
          Scan VIN barcode or QR code
        </Text>
        <Button title="Cancel" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
});