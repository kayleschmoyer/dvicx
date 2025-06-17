import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, loading, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff00ff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
