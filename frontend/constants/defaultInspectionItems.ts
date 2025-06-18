export interface DefaultInspectionItem {
  id: number;
  partNumber: string;
  description: string;
  position?: string;
}

export const DEFAULT_INSPECTION_ITEMS: DefaultInspectionItem[] = [
  { id: 1, partNumber: 'Tire', description: 'Tread depth', position: 'Left Front' },
  { id: 2, partNumber: 'Tire', description: 'Tread depth', position: 'Right Front' },
  { id: 3, partNumber: 'Tire', description: 'Tread depth', position: 'Left Rear' },
  { id: 4, partNumber: 'Tire', description: 'Tread depth', position: 'Right Rear' },
  { id: 5, partNumber: 'Wiper', description: 'Blade condition', position: 'Driver' },
  { id: 6, partNumber: 'Wiper', description: 'Blade condition', position: 'Passenger' },
  { id: 7, partNumber: 'Brake', description: 'Pad thickness', position: 'Front' },
  { id: 8, partNumber: 'Brake', description: 'Pad thickness', position: 'Rear' },
];
