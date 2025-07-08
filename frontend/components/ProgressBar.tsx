import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  completed: number;
  total: number;
  showText?: boolean;
}

export default function ProgressBar({ completed, total, showText = true }: Props) {
  const { theme } = useTheme();
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      {showText && (
        <View style={styles.textRow}>
          <Text style={[styles.label, { color: theme.text }]}>Progress</Text>
          <Text style={[styles.count, { color: theme.text }]}>
            {completed}/{total} ({Math.round(percentage)}%)
          </Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: theme.background }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${percentage}%`,
              backgroundColor: percentage === 100 ? '#4CAF50' : '#2196F3'
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});