"use client";

import { useEffect, useState } from "react";
import DmpList from "@/components/dmp-list";
import { StoreFilters } from "@/components/store-filters";
import { Store, DMP } from "@/types/store";

export default function NewBookingPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [dmpList, setDmpList] = useState<DMP[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        const data = await response.json();
        setStores(data);
        setFilteredStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchDmpZones = async () => {
      try {
        // Only fetch DMP zones for filtered stores
        const storeIds = filteredStores.map(store => store.id);
        const queryParams = new URLSearchParams();
        storeIds.forEach(id => queryParams.append('storeIds', id.toString()));
        
        const response = await fetch(`/api/stores/zones?${queryParams.toString()}`);
        const data = await response.json();
        setDmpList(data);
      } catch (error) {
        console.error('Error fetching DMP zones:', error);
      }
    };

    if (filteredStores.length > 0) {
      fetchDmpZones();
    } else {
      setDmpList([]);
    }
  }, [filteredStores]);

  const handleFilterChange = (filtered: Store[]) => {
    setFilteredStores(filtered);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Забронировать DMP зону</h1>
      <StoreFilters 
        stores={stores} 
        onFilterChange={handleFilterChange} 
      />
      <DmpList dmpList={dmpList} />
    </main>
  );
}
