import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getMechanics, verifyMechanicLogin } from '../services/api';
import MechanicCard from '../components/MechanicCard';
import PinModal from '../components/PinModal';

const COMPANY_ID = 1;

export default function MechanicSelectScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getMechanics(COMPANY_ID);
        setMechanics(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (id: number) => {
    setSelected(id);
    setModal(true);
  };

  const handleLogin = async (pin: string) => {
    if (!selected) return;
    try {
      const res = await verifyMechanicLogin({
        companyId: COMPANY_ID,
        mechanicNumber: selected,
        pin,
      });
      login(String(res.mechanicNumber), res.token);
    } catch (e) {
      console.error(e);
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
      <FlatList
        data={mechanics}
        keyExtractor={(m) => m.mechanicNumber.toString()}
        renderItem={({ item }) => (
          <MechanicCard
            mechanic={item}
            onPress={() => handleSelect(item.mechanicNumber)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
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
});
