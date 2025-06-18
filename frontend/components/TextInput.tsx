import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';

const TextInput = forwardRef<RNTextInput, TextInputProps>((props, ref) => {
  const { theme } = useTheme();
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor="#666"
      style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
});
