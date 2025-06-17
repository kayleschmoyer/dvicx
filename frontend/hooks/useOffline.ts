import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { submitInspection as apiSubmit } from '../services/api';

const STORAGE_KEY = 'offline-inspections';

export default function useOffline() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        flushQueue();
      }
    });
    flushQueue();
    return unsubscribe;
  }, []);

  const flushQueue = async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return;
    let queue: any[] = [];
    try {
      queue = JSON.parse(json);
    } catch {}
    const remaining: any[] = [];
    for (const item of queue) {
      try {
        await apiSubmit(item);
      } catch {
        remaining.push(item);
      }
    }
    if (remaining.length) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const enqueue = async (data: any) => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const queue = json ? JSON.parse(json) : [];
    queue.push(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  };

  const submitInspection = async (data: any) => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        await apiSubmit(data);
        return;
      } catch {
        // fall through to queue
      }
    }
    await enqueue(data);
  };

  return { submitInspection };
}
