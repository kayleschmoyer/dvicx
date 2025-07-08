import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  specification: string;
  onMeasurement: (value: string) => void;
}

export default function MeasurementHelper({ specification, onMeasurement }: Props) {
  const { theme } = useTheme();

  const getCommonValues = () => {
    if (specification.includes('2/32')) {
      return ['1/32"', '2/32"', '3/32"', '4/32"'];
    }
    if (specification.includes('3mm')) {
      return ['1mm', '2mm', '3mm', '4mm', '5mm'];
    }
    if (specification.includes('12.4V')) {
      return ['11.8V', '12.0V', '12.4V', '12.6V'];
    }
    if (specification.includes('PSI')) {
      return ['28', '30', '32', '35'];
    }
    return [];
  };

  const commonValues = getCommonValues();

  if (commonValues.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>Quick Measurements:</Text>
      <View style={styles.buttons}>
        {commonValues.map(value => (
          <TouchableOpacity
            key={value}
            style={styles.button}
            onPress={() => onMeasurement(value)}
          >
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
});