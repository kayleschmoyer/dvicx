import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pending-inspections';

export type QueueItem = any;

export async function getQueue(): Promise<QueueItem[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export async function setQueue(items: QueueItem[]): Promise<void> {
  if (!items.length) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function enqueue(item: QueueItem): Promise<void> {
  const queue = await getQueue();
  queue.push(item);
  await setQueue(queue);
}

export async function flushQueue(uploader: (item: QueueItem) => Promise<void>): Promise<void> {
  const queue = await getQueue();
  if (!queue.length) return;
  const remaining: QueueItem[] = [];
  for (const item of queue) {
    try {
      await uploader(item);
    } catch {
      remaining.push(item);
    }
  }
  await setQueue(remaining);
}
