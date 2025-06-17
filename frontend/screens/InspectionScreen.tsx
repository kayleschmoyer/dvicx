import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InspectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inspection Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
