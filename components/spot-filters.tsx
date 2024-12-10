"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface SpotFiltersProps {
  onFilterChange: (filters: SpotFilters) => void;
  dmpList: Array<{
    equipment: string;
    category: string;
    status: string;
    productCategory: string;
    price: number;
  }>;
}

export interface SpotFilters {
  searchTerm: string;
  categories: string[];
  statuses: string[];
  maxPrice: number | null;
}

export function SpotFilters({ dmpList, onFilterChange }: SpotFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<SpotFilters>({
    searchTerm: '',
    categories: [],
    statuses: [],
    maxPrice: null,
  });

  // Extract unique values for statuses
  const uniqueStatuses = Array.from(new Set(dmpList.map(dmp => dmp.status)));

  const handleFilterToggle = (filterType: 'categories' | 'statuses', value: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[filterType].includes(value)) {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    } else {
      newFilters[filterType] = [...newFilters[filterType], value];
    }
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    const newFilters = {
      ...selectedFilters,
      searchTerm: value,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: string) => {
    const price = value ? Number(value) : null;
    const newFilters = {
      ...selectedFilters,
      maxPrice: price,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getStatusStyle = (status: string, isSelected: boolean) => {
    if (!isSelected) {
      switch (status) {
        case 'Свободен':
          return 'border-green-200 text-green-600 hover:bg-green-50';
        case 'Занят':
          return 'border-red-200 text-red-600 hover:bg-red-50';
        case 'В ожидании':
          return 'border-blue-200 text-blue-600 hover:bg-blue-50';
        default:
          return 'border-gray-200 text-gray-600 hover:bg-gray-50';
      }
    } else {
      switch (status) {
        case 'Свободен':
          return 'bg-green-600 hover:bg-green-700 text-white';
        case 'Занят':
          return 'bg-red-600 hover:bg-red-700 text-white';
        case 'В ожидании':
          return 'bg-blue-600 hover:bg-blue-700 text-white';
        default:
          return 'bg-gray-600 hover:bg-gray-700 text-white';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Поиск по оборудованию и категории продукта</Label>
          <Input
            type="text"
            placeholder="Введите текст для поиска..."
            value={selectedFilters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Максимальная цена</Label>
          <Input
            type="number"
            placeholder="Введите максимальную цену"
            value={selectedFilters.maxPrice || ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Статус</Label>
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {uniqueStatuses.map((status) => (
              <Button
                key={status}
                variant={selectedFilters.statuses.includes(status) ? "default" : "outline"}
                onClick={() => handleFilterToggle("statuses", status)}
                className={`text-sm whitespace-nowrap ${getStatusStyle(status, selectedFilters.statuses.includes(status))}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
