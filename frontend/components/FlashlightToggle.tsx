import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FlashlightToggle() {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(!isOn);
    // Mock flashlight toggle - would use expo-camera or similar
    console.log('Flashlight:', !isOn ? 'ON' : 'OFF');
  };

  return (
    <TouchableOpacity 
      style={[styles.button, isOn && styles.active]} 
      onPress={toggle}
    >
      <Text style={styles.icon}>{isOn ? '🔦' : '💡'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#ffeb3b',
  },
  icon: {
    fontSize: 20,
  },
});