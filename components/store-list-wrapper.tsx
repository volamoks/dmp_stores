"use client";

import { useState, useEffect } from "react";
import StoreList from "./store-list";
import { Store } from "@/types/store";

interface StoreListWrapperProps {
  initialStores: Store[];
  totalStores: number;
  itemsPerPage: number;
}

export default function StoreListWrapper({
  initialStores,
  totalStores,
  itemsPerPage,
}: StoreListWrapperProps) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(itemsPerPage);
  const [total, setTotal] = useState(totalStores);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStores = async (page: number, itemsLimit: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/stores?page=${page}&limit=${itemsLimit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stores');
      }

      setStores(data.stores);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1 || limit !== itemsPerPage) {
      fetchStores(currentPage, limit);
    }
  }, [currentPage, limit, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  return (
    <StoreList
      stores={stores}
      pagination={{
        total: total,
        page: currentPage,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      }}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      currentPage={currentPage}
      itemsPerPage={limit}
      isLoading={isLoading}
    />
  );
}
