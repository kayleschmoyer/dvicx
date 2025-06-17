import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getLineItems, submitInspection } from '../services/api';
import { InspectionItemCard, Button } from '../components';
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
  const [submitting, setSubmitting] = useState(false);

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
    try {
      await submitInspection({ orderId: order.estimateNo, items });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff00ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: '#1c1c1c',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  submit: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
