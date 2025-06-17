import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, loading, style }: Props) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.accent }, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
