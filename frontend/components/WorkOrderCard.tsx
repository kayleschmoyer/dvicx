import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks';

interface Props {
  order: {
    estimateNo: number;
    firstName: string;
    lastName: string;
    carYear: string;
    make: string;
    model: string;
    engineType: string;
    license: string;
    date: string;
    status: string;
  };
  onPress: () => void;
  style?: ViewStyle;
}

export default function WorkOrderCard({ order, onPress, style }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.card, style, { opacity: fadeAnim, backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.title, { color: theme.text }]}>WO #{order.estimateNo}</Text>
        <Text style={[styles.customer, { color: theme.text }]}>{order.firstName} {order.lastName}</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {order.carYear} {order.make} {order.model} {order.engineType}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>License: {order.license}</Text>
        <Text style={[styles.sub, { color: theme.text }]}>{new Date(order.date).toLocaleDateString()} • {order.status}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  customer: {
    fontSize: 16,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  sub: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Inter',
  },
});
