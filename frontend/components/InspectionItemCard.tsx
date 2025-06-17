import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import StatusSelector, { Status } from './StatusSelector';
import TextInput from './TextInput';
import PhotoUploader from './PhotoUploader';

export interface InspectionItem {
  id: number;
  partNumber: string;
  description: string;
  status?: Status | null;
  reason?: string;
  photo?: string;
}

interface Props {
  item: InspectionItem;
  onChange: (item: InspectionItem) => void;
}

export default function InspectionItemCard({ item, onChange }: Props) {
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.title}>{item.partNumber}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <StatusSelector value={item.status || null} onChange={(s) => update({ status: s })} />
      <TextInput
        placeholder="Reason (optional)"
        value={item.reason}
        onChangeText={(t) => update({ reason: t })}
      />
      <PhotoUploader value={item.photo} onChange={(uri) => update({ photo: uri })} />
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
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    color: '#eaeaea',
    marginBottom: 8,
  },
});
