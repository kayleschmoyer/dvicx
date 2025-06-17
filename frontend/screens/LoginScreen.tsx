import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, ThemeToggle } from '../components';
import api from '../services/api';
import { AuthContext, ThemeContext } from '../contexts';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
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
      const response = await api.post('/mechanic/login', { mechanicId, pin });
      const { token, mechanicId: id } = response.data;
      login(id, token);
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemeToggle />
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
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={handleSubmit} loading={loading} style={styles.button} />
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
