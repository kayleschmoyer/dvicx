import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  onRecording: (uri: string) => void;
}

export default function VoiceRecorder({ onRecording }: Props) {
  const [recording, setRecording] = useState(false);
  const { theme } = useTheme();

  const toggleRecording = async () => {
    if (recording) {
      // Stop recording and get transcription
      setRecording(false);
      // This would use expo-speech or similar for real transcription
      // For now, prompt user to type what they said
      const text = await new Promise<string>((resolve) => {
        // Mock - in real app this would be speech-to-text
        setTimeout(() => resolve('Brake pad worn to 1mm thickness'), 1000);
      });
      onRecording(text);
    } else {
      // Start recording
      setRecording(true);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        recording && styles.recording,
        { backgroundColor: recording ? '#ff4444' : theme.accent }
      ]}
      onPress={toggleRecording}
    >
      <Text style={styles.icon}>{recording ? '⏹' : '🎤'}</Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {recording ? 'Stop' : 'Voice Note'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  recording: {
    backgroundColor: '#ff4444',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});