import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getWorkOrders } from '../services/api';
import WorkOrderCard from '../components/WorkOrderCard';
import { ThemeToggle, SyncStatusBadge } from '../components';
import { useNavigation } from '@react-navigation/native';

interface WorkOrder {
  estimateNo: number;
  firstName: string;
  lastName: string;
  carYear: string;
  vehMake: string;
  vehModel: string;
  engineType: string;
  license: string;
  date: string;
  status: string;
}

export default function WorkOrdersScreen() {
  const { mechanicId } = useContext(AuthContext);
  const { theme } = useTheme();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const load = async () => {
      if (!mechanicId) return;
      try {
        const data = await getWorkOrders(mechanicId);
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mechanicId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#ff00ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SyncStatusBadge />
      <ThemeToggle />
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No work orders assigned</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.estimateNo.toString()}
          renderItem={({ item }) => (
            <WorkOrderCard
              order={item}
              onPress={() => navigation.navigate('Inspection', { order: item })}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
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
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter',
    marginTop: 20,
  },
});
