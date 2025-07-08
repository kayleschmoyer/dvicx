import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ThemeToggle() {
  // Theme toggle removed - app uses light theme only
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
});