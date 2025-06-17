import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export type Status = 'green' | 'yellow' | 'red' | 'na';

interface Props {
  value: Status | null;
  onChange: (status: Status) => void;
}

const options: { label: string; value: Status; color: string }[] = [
  { label: 'Green', value: 'green', color: '#2ecc71' },
  { label: 'Yellow', value: 'yellow', color: '#f1c40f' },
  { label: 'Red', value: 'red', color: '#e74c3c' },
  { label: 'N/A', value: 'na', color: '#7f8c8d' },
];

export default function StatusSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.button,
            { backgroundColor: opt.color, opacity: value === opt.value ? 1 : 0.5 },
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={styles.text}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
