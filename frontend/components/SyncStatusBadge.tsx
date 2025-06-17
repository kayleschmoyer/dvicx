import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SyncContext, ThemeContext } from '../contexts';

export default function SyncStatusBadge() {
  const { pending, syncing } = useContext(SyncContext);
  const { theme } = useContext(ThemeContext);

  if (pending === 0 && !syncing) return null;

  return (
    <View style={[styles.badge, { backgroundColor: theme.accent }]}>
      {syncing ? (
        <ActivityIndicator size="small" color={theme.text} />
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{pending}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
