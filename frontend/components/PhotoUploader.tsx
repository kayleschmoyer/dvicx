import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  value?: string | null;
  onChange: (uri: string) => void;
}

export default function PhotoUploader({ value, onChange }: Props) {
  const pick = async (useCamera: boolean) => {
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {value && <Image source={{ uri: value }} style={styles.image} />}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => pick(true)}>
          <Text style={styles.text}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => pick(false)}>
          <Text style={styles.text}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  image: { width: 100, height: 100, borderRadius: 4, marginBottom: 8 },
  buttons: { flexDirection: 'row' },
  button: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  text: { color: '#fff', fontSize: 12 },
});
