import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, SyncStatusBadge } from '../components';
import { loginMechanic } from '../services/api';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [mechanicId, setMechanicId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!mechanicId && !pin) {
      setError('Please enter Mechanic ID or PIN');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await loginMechanic({ mechanicId: Number(mechanicId) || undefined, pin });
      const { token, mechanicId: id } = response.data;
      login(String(id), token);
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SyncStatusBadge />
      <Text style={[styles.title, { color: theme.text }]}>Mechanic Login</Text>
      <TextInput
        placeholder="Mechanic ID"
        value={mechanicId}
        onChangeText={setMechanicId}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="number-pad"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Login"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      />
      <Button title="Cancel" onPress={() => navigation.goBack()} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
});
