export const INSPECTION_TEMPLATES = {
  'standard': 'Standard Vehicle',
  'truck': 'Truck/SUV',
  'motorcycle': 'Motorcycle',
  'electric': 'Electric Vehicle',
  'diesel': 'Diesel Vehicle'
};

export const getTemplateItems = (template: string) => {
  const base = [
    { id: 1, partNumber: 'Tire', description: 'Tread depth', position: 'Left Front', category: 'Tires' },
    { id: 2, partNumber: 'Tire', description: 'Tread depth', position: 'Right Front', category: 'Tires' },
    { id: 3, partNumber: 'Brake Pad', description: 'Thickness', position: 'Front', category: 'Brakes' },
    { id: 4, partNumber: 'Engine Oil', description: 'Level and condition', category: 'Fluids' },
  ];

  switch (template) {
    case 'truck':
      return [
        ...base,
        { id: 50, partNumber: 'Differential', description: 'Fluid level', category: 'Drivetrain' },
        { id: 51, partNumber: 'Transfer Case', description: 'Fluid level', category: 'Drivetrain' },
      ];
    case 'electric':
      return [
        ...base.filter(item => !item.partNumber.includes('Oil')),
        { id: 60, partNumber: 'Battery Pack', description: 'Voltage and connections', category: 'Electric' },
        { id: 61, partNumber: 'Charging Port', description: 'Condition', category: 'Electric' },
      ];
    case 'motorcycle':
      return [
        { id: 70, partNumber: 'Chain', description: 'Tension and lubrication', category: 'Drivetrain' },
        { id: 71, partNumber: 'Tire', description: 'Tread depth', position: 'Front', category: 'Tires' },
        { id: 72, partNumber: 'Tire', description: 'Tread depth', position: 'Rear', category: 'Tires' },
      ];
    default:
      return base;
  }
};