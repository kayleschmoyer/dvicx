import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getLineItems } from '../services/api';
import { InspectionItemCard, Button, SyncStatusBadge } from '../components';
import { SyncContext } from '../contexts';
import { useTheme } from '../hooks';
import type { InspectionItem } from '../components/InspectionItemCard';

interface RouteParams {
  order: {
    estimateNo: number;
  };
}

export default function InspectionScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const order = (route.params as RouteParams).order;
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const { enqueue } = useContext(SyncContext);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLineItems(order.estimateNo);
        setItems(data.map((it: any, idx: number) => ({
          id: it.id || idx,
          partNumber: it.PART_NUMBER || it.partNumber,
          description: it.DESCRIPTION || it.description,
          status: null,
        })));
      } catch (e) {
        console.error(e);
        setError('Failed to load inspection items');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [order]);

  const updateItem = (updated: InspectionItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await enqueue({ orderId: order.estimateNo, items });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#ff00ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SyncStatusBadge />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <InspectionItemCard item={item} onChange={updateItem} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.submit}>
        <Button title="Submit" onPress={handleSubmit} loading={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
