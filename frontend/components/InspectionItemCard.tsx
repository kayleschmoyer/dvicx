import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import StatusSelector, { Status } from './StatusSelector';
import TextInput from './TextInput';
import PhotoUploader from './PhotoUploader';
import QuickActions from './QuickActions';
import VoiceRecorder from './VoiceRecorder';
import MeasurementHelper from './MeasurementHelper';

export interface InspectionItem {
  id: number;
  partNumber: string;
  description: string;
  position?: string | null;
  status?: Status | null;
  reason?: string;
  photo?: string;
  measurement?: string;
  specification?: string;
  requiresMeasurement?: boolean;
  voiceNote?: string;
}

interface Props {
  item: InspectionItem;
  onChange: (item: InspectionItem) => void;
}

export default function InspectionItemCard({ item, onChange }: Props) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const update = (updates: Partial<InspectionItem>) => {
    onChange({ ...item, ...updates });
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }], backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{item.partNumber}</Text>
      <Text style={[styles.desc, { color: theme.text }]}>{item.description}</Text>
      {item.position && (
        <Text style={[styles.position, { color: theme.text }]}>{item.position}</Text>
      )}
      <StatusSelector value={item.status || null} onChange={(s) => update({ status: s })} />
      <QuickActions 
        partNumber={item.partNumber}
        description={item.description}
        onQuickAction={(action, reason) => update({ 
          status: action as Status, 
          reason: (action === 'yellow' || action === 'red') ? reason : undefined 
        })} 
      />
      {item.requiresMeasurement && (
        <View style={styles.measurementRow}>
          <TextInput
            placeholder={`Measurement (${item.specification || 'mm'})`}
            value={item.measurement}
            onChangeText={(t) => update({ measurement: t })}
            keyboardType="numeric"
            style={styles.measurementInput}
          />
          {item.specification && (
            <Text style={[styles.spec, { color: theme.text }]}>Spec: {item.specification}</Text>
          )}
          {item.specification && (
            <MeasurementHelper 
              specification={item.specification}
              onMeasurement={(value) => update({ measurement: value })}
            />
          )}
        </View>
      )}
      {(item.status === 'yellow' || item.status === 'red') && (
        <>
          <TextInput
            placeholder="Reason/Notes"
            value={item.reason}
            onChangeText={(t) => update({ reason: t })}
            multiline
          />
          <PhotoUploader
            value={item.photo}
            onChange={(uri) => update({ photo: uri })}
          />
          <VoiceRecorder
            onRecording={(text) => update({ reason: (item.reason || '') + ' ' + text })}
          />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2b2b2b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    marginBottom: 8,
  },
  position: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  measurementRow: {
    marginBottom: 8,
  },
  measurementInput: {
    marginBottom: 4,
  },
  spec: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
