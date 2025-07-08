import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  WORK_ORDERS: 'offline_work_orders',
  INSPECTIONS: 'offline_inspections',
  PHOTOS: 'offline_photos',
  VEHICLE_DATA: 'offline_vehicle_data',
};

export interface OfflineInspection {
  id: string;
  orderId: number;
  mechanicId: number;
  items: any[];
  vehicleData?: any;
  signature?: string;
  timestamp: number;
  synced: boolean;
}

export const saveWorkOrders = async (orders: any[]) => {
  await AsyncStorage.setItem(KEYS.WORK_ORDERS, JSON.stringify(orders));
};

export const getWorkOrders = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(KEYS.WORK_ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveInspection = async (inspection: OfflineInspection) => {
  const inspections = await getInspections();
  const existing = inspections.findIndex(i => i.id === inspection.id);
  
  if (existing >= 0) {
    inspections[existing] = inspection;
  } else {
    inspections.push(inspection);
  }
  
  await AsyncStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(inspections));
};

export const getInspections = async (): Promise<OfflineInspection[]> => {
  const data = await AsyncStorage.getItem(KEYS.INSPECTIONS);
  return data ? JSON.parse(data) : [];
};

export const getUnsyncedInspections = async (): Promise<OfflineInspection[]> => {
  const inspections = await getInspections();
  return inspections.filter(i => !i.synced);
};

export const markInspectionSynced = async (id: string) => {
  const inspections = await getInspections();
  const inspection = inspections.find(i => i.id === id);
  if (inspection) {
    inspection.synced = true;
    await AsyncStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(inspections));
  }
};

export const savePhoto = async (uri: string, inspectionId: string, itemId: number) => {
  const photos = await getPhotos();
  const photoId = `${inspectionId}_${itemId}_${Date.now()}`;
  photos[photoId] = { uri, inspectionId, itemId, synced: false };
  await AsyncStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
  return photoId;
};

export const getPhotos = async (): Promise<Record<string, any>> => {
  const data = await AsyncStorage.getItem(KEYS.PHOTOS);
  return data ? JSON.parse(data) : {};
};

export const clearSyncedData = async () => {
  const inspections = await getInspections();
  const unsyncedInspections = inspections.filter(i => !i.synced);
  await AsyncStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(unsyncedInspections));
  
  const photos = await getPhotos();
  const unsyncedPhotos = Object.fromEntries(
    Object.entries(photos).filter(([_, photo]: [string, any]) => !photo.synced)
  );
  await AsyncStorage.setItem(KEYS.PHOTOS, JSON.stringify(unsyncedPhotos));
};