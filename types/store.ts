export interface MonthlyAvailability {
  [key: string]: boolean;
}

export interface DMP {
  id: number;
  uniqueId: string;
  zoneId: string;
  equipment: string;
  dmpProductNeighboring: string;
  purpose: string;
  subPurpose: string;
  category: 'FOOD' | 'NON_FOOD';
  supplier: string;
  brand: string;
  productCategory: string;
  status: 'OCCUPIED' | 'VACANT';
  comment?: string;
  price: number;
  monthlyAvailability: MonthlyAvailability;
}

export interface Store {
  id: number;
  externalId: string;
  name: string;
  region: string;
  city: string;
  newFormat: string;
  equipmentFormat: string;
  dmpZones: DMP[];
}

