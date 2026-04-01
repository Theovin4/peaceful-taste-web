export interface DeliveryLocation {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export const DELIVERY_LOCATIONS: DeliveryLocation[] = [
  {
    id: 'lagos',
    name: 'Lagos (All Areas)',
    cost: 5000,
    description: 'Delivery within Lagos State',
  },
  {
    id: 'magboro',
    name: 'Magboro',
    cost: 3500,
    description: 'Magboro and surrounding areas',
  },
  {
    id: 'ibafo',
    name: 'Ibafo',
    cost: 3500,
    description: 'Ibafo and surrounding areas',
  },
  {
    id: 'mowe',
    name: 'Mowe',
    cost: 3500,
    description: 'Mowe and surrounding areas',
  },
];

export function getDeliveryLocationName(id: string): string {
  const location = DELIVERY_LOCATIONS.find(loc => loc.id === id);
  return location ? location.name : 'Unknown';
}

export function getDeliveryCost(id: string): number {
  const location = DELIVERY_LOCATIONS.find(loc => loc.id === id);
  return location ? location.cost : 0;
}
