import React, { useContext } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts';

export default function ThemeToggle() {
  const { mode, toggleTheme, theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Switch
        value={mode === 'dark'}
        onValueChange={toggleTheme}
        thumbColor={theme.accent}
        trackColor={{ true: theme.accent, false: '#ccc' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
});
