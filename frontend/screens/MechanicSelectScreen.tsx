import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getMechanics, loginMechanic } from '../services/api';
import MechanicCard from '../components/MechanicCard';
import PinModal from '../components/PinModal';

const COMPANY_ID = 7638;

export default function MechanicSelectScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('📡 Fetching mechanics for company ID:', COMPANY_ID);
        const list = await getMechanics(COMPANY_ID);
        console.log('✅ Mechanics loaded:', list);
        setMechanics(list);
      } catch (e) {
        console.error('❌ Failed to load mechanics:', e);
        setError('Failed to load mechanics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(id);
    setModal(true);
  };

  const handleLogin = async (pin: string) => {
    if (!selected) return;
    try {
      console.log('🔐 Attempting login with', {
        companyId: COMPANY_ID,
        mechanicId: selected,
        pin,
      });

      const res = await loginMechanic({
        mechanicId: parseInt(selected, 10),
        pin,
      });

      console.log('✅ Login success:', res);
      login(String(res.mechanicId), res.token);
    } catch (e) {
      console.error('❌ Login failed:', e);
      setError('Incorrect PIN or login failed.');
    } finally {
      setModal(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {error && (
        <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>
      )}

      {mechanics.length === 0 ? (
        <Text style={[styles.error, { color: theme.text, textAlign: 'center', marginTop: 40 }]}>
          No mechanics available. Please verify MobileEnabled is 1 and HOME_SHOP is {COMPANY_ID}.
        </Text>
      ) : (
        <FlatList
          data={mechanics}
          keyExtractor={(m) => m.mechanicId}
          renderItem={({ item }) => (
            <MechanicCard
              mechanic={item}
              onPress={() => handleSelect(item.mechanicId)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <PinModal
        visible={modal}
        onClose={() => setModal(false)}
        onSubmit={handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { textAlign: 'center', margin: 16 },
});
