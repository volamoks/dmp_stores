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
    status: 'Свободен' | 'Занят' | 'В ожидании';
    storeId: number;
    comment: string | null;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
