import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getWorkOrders } from '../services/api';
import WorkOrderCard from '../components/WorkOrderCard';
import { ThemeToggle, SyncStatusBadge, Button } from '../components';
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
  const { mechanicId, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const load = async () => {
      if (!mechanicId) return;
      try {
        console.log('📡 Fetching work orders for mechanic ID:', mechanicId);
        const data = await getWorkOrders(mechanicId);
        console.log('✅ Work orders loaded:', data);
        setOrders(data);
        if (Array.isArray(data) && data.length === 0) {
          setError('No work orders assigned to this mechanic');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('❌ Error loading work orders:', err.response?.data || err.message);
          if (err.response?.status === 404) {
            setError('No work orders assigned to this mechanic');
          } else {
            setError('Failed to load work orders');
          }
        } else {
          console.error('❌ Error loading work orders:', err);
          setError('Failed to load work orders');
        }
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
      <Button title="Logout" onPress={logout} style={styles.logoutButton} />
      {error ? (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: theme.text }]}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
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
  logoutButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
  },
});
