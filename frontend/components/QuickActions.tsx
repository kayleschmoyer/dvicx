import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './Button';
import { useTheme } from '../hooks';

interface Props {
  onQuickAction: (action: string, reason: string) => void;
  partNumber: string;
  description: string;
}

const getQuickActions = (partNumber: string, description: string) => {
  const part = partNumber.toLowerCase();
  const desc = description.toLowerCase();
  
  const common = [
    { action: 'green', reason: 'Within specification', label: 'Good' },
    { action: 'na', reason: 'Not applicable to this vehicle', label: 'N/A' },
  ];
  
  if (part.includes('tire')) {
    return [
      { action: 'red', reason: 'Below 2/32" tread depth', label: 'Worn' },
      { action: 'red', reason: 'Sidewall damage or bulge', label: 'Damaged' },
      { action: 'yellow', reason: 'Uneven wear pattern', label: 'Uneven' },
      { action: 'yellow', reason: 'Low pressure', label: 'Low PSI' },
      ...common
    ];
  }
  
  if (part.includes('brake')) {
    return [
      { action: 'red', reason: 'Below minimum thickness', label: 'Worn' },
      { action: 'red', reason: 'Cracked or glazed', label: 'Damaged' },
      { action: 'yellow', reason: 'Approaching wear limit', label: 'Wear Soon' },
      { action: 'red', reason: 'Brake fluid leak', label: 'Leaking' },
      ...common
    ];
  }
  
  if (part.includes('wiper')) {
    return [
      { action: 'red', reason: 'Torn or cracked blade', label: 'Torn' },
      { action: 'red', reason: 'Streaking or chattering', label: 'Streaking' },
      { action: 'yellow', reason: 'Hardened rubber', label: 'Hard' },
      ...common
    ];
  }
  
  if (part.includes('oil') || part.includes('fluid') || part.includes('coolant')) {
    return [
      { action: 'red', reason: 'Low level', label: 'Low' },
      { action: 'red', reason: 'Contaminated or dirty', label: 'Dirty' },
      { action: 'red', reason: 'Leak detected', label: 'Leaking' },
      { action: 'yellow', reason: 'Due for change', label: 'Change Soon' },
      ...common
    ];
  }
  
  if (part.includes('light') || part.includes('headlight') || part.includes('taillight')) {
    return [
      { action: 'red', reason: 'Bulb burned out', label: 'Burned Out' },
      { action: 'red', reason: 'Lens cracked or broken', label: 'Cracked' },
      { action: 'yellow', reason: 'Dim or flickering', label: 'Dim' },
      ...common
    ];
  }
  
  if (part.includes('battery')) {
    return [
      { action: 'red', reason: 'Low voltage', label: 'Low Voltage' },
      { action: 'red', reason: 'Corroded terminals', label: 'Corroded' },
      { action: 'yellow', reason: 'Weak performance', label: 'Weak' },
      ...common
    ];
  }
  
  if (part.includes('belt') || part.includes('hose')) {
    return [
      { action: 'red', reason: 'Cracked or frayed', label: 'Cracked' },
      { action: 'red', reason: 'Loose or slipping', label: 'Loose' },
      { action: 'yellow', reason: 'Minor surface cracks', label: 'Aging' },
      ...common
    ];
  }
  
  // Default for other parts
  return [
    { action: 'red', reason: 'Failed inspection', label: 'Failed' },
    { action: 'red', reason: 'Damaged or worn', label: 'Damaged' },
    { action: 'yellow', reason: 'Needs attention', label: 'Attention' },
    ...common
  ];
};

export default function QuickActions({ onQuickAction, partNumber, description }: Props) {
  const { theme } = useTheme();
  const quickActions = getQuickActions(partNumber, description);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.actions}>
          {quickActions.map((item, index) => (
            <Button
              key={index}
              title={item.label}
              onPress={() => onQuickAction(item.action, item.reason)}
              style={[
                styles.actionButton,
                item.action === 'red' && styles.redButton,
                item.action === 'yellow' && styles.yellowButton,
                item.action === 'green' && styles.greenButton,
                item.action === 'na' && styles.naButton,
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
  },
  redButton: {
    backgroundColor: '#ffcdd2',
  },
  yellowButton: {
    backgroundColor: '#fff9c4',
  },
  greenButton: {
    backgroundColor: '#c8e6c9',
  },
  naButton: {
    backgroundColor: '#f5f5f5',
  },
});