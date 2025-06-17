import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { submitInspection } from '../services/api';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { enqueue as enqueueItem, getQueue, flushQueue } from '../utils/syncQueue';

interface SyncContextProps {
  pending: number;
  syncing: boolean;
  enqueue: (data: any) => Promise<void>;
}

export const SyncContext = createContext<SyncContextProps>({
  pending: 0,
  syncing: false,
  enqueue: async () => {},
});

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useNetworkStatus();
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const loadPending = useCallback(async () => {
    const q = await getQueue();
    setPending(q.length);
  }, []);

  const processQueue = useCallback(async () => {
    if (!isConnected) return;
    setSyncing(true);
    await flushQueue(submitInspection);
    setSyncing(false);
    loadPending();
  }, [isConnected, loadPending]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  useEffect(() => {
    if (isConnected) {
      processQueue();
    }
  }, [isConnected, processQueue]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        processQueue();
      }
    });
    return () => sub.remove();
  }, [processQueue]);

  const enqueue = async (data: any) => {
    await enqueueItem(data);
    loadPending();
    if (isConnected) {
      processQueue();
    }
  };

  return (
    <SyncContext.Provider value={{ pending, syncing, enqueue }}>
      {children}
    </SyncContext.Provider>
  );
};
