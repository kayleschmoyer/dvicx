import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  order: {
    estimateNo: number;
    vehYear: string;
    vehMake: string;
    vehModel: string;
    license: string;
    date: string;
    status: string;
  };
  onPress: () => void;
  style?: ViewStyle;
}

export default function WorkOrderCard({ order, onPress, style }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.card, style, { opacity: fadeAnim }]}> 
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>WO #{order.estimateNo}</Text>
        <Text style={styles.text}>{order.vehYear} {order.vehMake} {order.vehModel}</Text>
        <Text style={styles.text}>License: {order.license}</Text>
        <Text style={styles.sub}>{new Date(order.date).toLocaleDateString()} • {order.status}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2b2b2b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    color: '#eaeaea',
    fontSize: 14,
  },
  sub: {
    color: '#bbbbbb',
    marginTop: 6,
    fontSize: 12,
  },
});
