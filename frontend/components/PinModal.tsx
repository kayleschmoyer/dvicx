import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import TextInput from './TextInput';
import Button from './Button';
import { useTheme } from '../hooks';

interface Props {
  visible: boolean;
  onSubmit: (pin: string) => void;
  onClose: () => void;
}

export default function PinModal({ visible, onSubmit, onClose }: Props) {
  const { theme } = useTheme();
  const [pin, setPin] = useState('');

  const handle = () => {
    onSubmit(pin);
    setPin('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: theme.background }]}>
          <TextInput
            placeholder="PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="number-pad"
          />
          <Button title="Submit" onPress={handle} style={styles.button} />
          <Button title="Cancel" onPress={onClose} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  box: {
    width: '80%',
    padding: 20,
    borderRadius: 8,
  },
  button: {
    marginTop: 8,
  },
});
