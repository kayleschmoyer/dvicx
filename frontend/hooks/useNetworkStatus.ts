import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const handle = (state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
    };
    const unsubscribe = NetInfo.addEventListener(handle);
    NetInfo.fetch().then(handle);
    return unsubscribe;
  }, []);

  return { isConnected };
}
