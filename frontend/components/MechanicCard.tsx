import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  mechanic: { mechanicId: number; name: string; role: string };
  onPress: () => void;
}

export default function MechanicCard({ mechanic, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.background }]}
      onPress={onPress}
    >
      <Text style={[styles.name, { color: theme.text }]}>{mechanic.name}</Text>
      <Text style={[styles.role, { color: theme.text }]}>{mechanic.role}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  role: {
    marginTop: 4,
    fontFamily: 'Inter',
  },
});
