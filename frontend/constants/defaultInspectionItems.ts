export interface DefaultInspectionItem {
  id: number;
  partNumber: string;
  description: string;
  position?: string;
  requiresMeasurement?: boolean;
  specification?: string;
  category: string;
}

export const DEFAULT_INSPECTION_ITEMS: DefaultInspectionItem[] = [
  // Tires
  { id: 1, partNumber: 'Tire', description: 'Tread depth', position: 'Left Front', requiresMeasurement: true, specification: '≥2/32"', category: 'Tires' },
  { id: 2, partNumber: 'Tire', description: 'Tread depth', position: 'Right Front', requiresMeasurement: true, specification: '≥2/32"', category: 'Tires' },
  { id: 3, partNumber: 'Tire', description: 'Tread depth', position: 'Left Rear', requiresMeasurement: true, specification: '≥2/32"', category: 'Tires' },
  { id: 4, partNumber: 'Tire', description: 'Tread depth', position: 'Right Rear', requiresMeasurement: true, specification: '≥2/32"', category: 'Tires' },
  { id: 5, partNumber: 'Tire', description: 'Pressure', position: 'Left Front', requiresMeasurement: true, specification: 'PSI per door sticker', category: 'Tires' },
  { id: 6, partNumber: 'Tire', description: 'Pressure', position: 'Right Front', requiresMeasurement: true, specification: 'PSI per door sticker', category: 'Tires' },
  { id: 7, partNumber: 'Tire', description: 'Pressure', position: 'Left Rear', requiresMeasurement: true, specification: 'PSI per door sticker', category: 'Tires' },
  { id: 8, partNumber: 'Tire', description: 'Pressure', position: 'Right Rear', requiresMeasurement: true, specification: 'PSI per door sticker', category: 'Tires' },
  
  // Brakes
  { id: 9, partNumber: 'Brake Pad', description: 'Thickness', position: 'Front Left', requiresMeasurement: true, specification: '≥3mm', category: 'Brakes' },
  { id: 10, partNumber: 'Brake Pad', description: 'Thickness', position: 'Front Right', requiresMeasurement: true, specification: '≥3mm', category: 'Brakes' },
  { id: 11, partNumber: 'Brake Pad', description: 'Thickness', position: 'Rear Left', requiresMeasurement: true, specification: '≥3mm', category: 'Brakes' },
  { id: 12, partNumber: 'Brake Pad', description: 'Thickness', position: 'Rear Right', requiresMeasurement: true, specification: '≥3mm', category: 'Brakes' },
  { id: 13, partNumber: 'Brake Rotor', description: 'Thickness', position: 'Front', requiresMeasurement: true, specification: 'Min thickness stamped', category: 'Brakes' },
  { id: 14, partNumber: 'Brake Rotor', description: 'Thickness', position: 'Rear', requiresMeasurement: true, specification: 'Min thickness stamped', category: 'Brakes' },
  
  // Fluids
  { id: 15, partNumber: 'Engine Oil', description: 'Level and condition', category: 'Fluids' },
  { id: 16, partNumber: 'Coolant', description: 'Level and condition', category: 'Fluids' },
  { id: 17, partNumber: 'Brake Fluid', description: 'Level and condition', category: 'Fluids' },
  { id: 18, partNumber: 'Power Steering', description: 'Level and condition', category: 'Fluids' },
  { id: 19, partNumber: 'Transmission', description: 'Level and condition', category: 'Fluids' },
  
  // Lights
  { id: 20, partNumber: 'Headlight', description: 'Operation', position: 'Left', category: 'Lights' },
  { id: 21, partNumber: 'Headlight', description: 'Operation', position: 'Right', category: 'Lights' },
  { id: 22, partNumber: 'Taillight', description: 'Operation', position: 'Left', category: 'Lights' },
  { id: 23, partNumber: 'Taillight', description: 'Operation', position: 'Right', category: 'Lights' },
  { id: 24, partNumber: 'Turn Signal', description: 'Operation', position: 'Front Left', category: 'Lights' },
  { id: 25, partNumber: 'Turn Signal', description: 'Operation', position: 'Front Right', category: 'Lights' },
  { id: 26, partNumber: 'Turn Signal', description: 'Operation', position: 'Rear Left', category: 'Lights' },
  { id: 27, partNumber: 'Turn Signal', description: 'Operation', position: 'Rear Right', category: 'Lights' },
  
  // Wipers
  { id: 28, partNumber: 'Wiper Blade', description: 'Condition', position: 'Driver', category: 'Wipers' },
  { id: 29, partNumber: 'Wiper Blade', description: 'Condition', position: 'Passenger', category: 'Wipers' },
  { id: 30, partNumber: 'Wiper Blade', description: 'Condition', position: 'Rear', category: 'Wipers' },
  
  // Battery
  { id: 31, partNumber: 'Battery', description: 'Voltage', requiresMeasurement: true, specification: '≥12.4V', category: 'Electrical' },
  { id: 32, partNumber: 'Battery', description: 'Terminal condition', category: 'Electrical' },
  
  // Belts & Hoses
  { id: 33, partNumber: 'Serpentine Belt', description: 'Condition and tension', category: 'Engine' },
  { id: 34, partNumber: 'Radiator Hoses', description: 'Condition', category: 'Engine' },
  
  // Suspension
  { id: 35, partNumber: 'Shock/Strut', description: 'Condition', position: 'Front Left', category: 'Suspension' },
  { id: 36, partNumber: 'Shock/Strut', description: 'Condition', position: 'Front Right', category: 'Suspension' },
  { id: 37, partNumber: 'Shock/Strut', description: 'Condition', position: 'Rear Left', category: 'Suspension' },
  { id: 38, partNumber: 'Shock/Strut', description: 'Condition', position: 'Rear Right', category: 'Suspension' },
];
