import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';

export default function TextInput(props: TextInputProps) {
  const { theme } = useTheme();
  return (
    <RNTextInput
      placeholderTextColor="#666"
      style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
});
