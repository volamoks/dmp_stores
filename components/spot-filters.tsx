import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface SpotFiltersProps {
  onFilterChange: (filters: SpotFilters) => void;
  dmpList: Array<{
    equipment: string;
    category: string;
    status: string;
  }>;
}

export interface SpotFilters {
  equipment: string[];
  categories: string[];
  statuses: string[];
}

export function SpotFilters({ dmpList, onFilterChange }: SpotFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<SpotFilters>({
    equipment: [],
    categories: [],
    statuses: [],
  });

  // Extract unique values for each filter type
  const uniqueEquipment = Array.from(new Set(dmpList.map(dmp => dmp.equipment)));
  const uniqueCategories = Array.from(new Set(dmpList.map(dmp => dmp.category)));
  const uniqueStatuses = Array.from(new Set(dmpList.map(dmp => dmp.status)));

  const handleFilterToggle = (filterType: keyof SpotFilters, value: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[filterType].includes(value)) {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    } else {
      newFilters[filterType] = [...newFilters[filterType], value];
    }
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Оборудование</Label>
          <div className="flex flex-wrap gap-2">
            {uniqueEquipment.map((eq) => (
              <Button
                key={eq}
                variant={selectedFilters.equipment.includes(eq) ? "default" : "outline"}
                onClick={() => handleFilterToggle("equipment", eq)}
                className={`text-sm ${
                  selectedFilters.equipment.includes(eq)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                {eq}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Категории</Label>
          <div className="flex flex-wrap gap-2">
            {uniqueCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedFilters.categories.includes(cat) ? "default" : "outline"}
                onClick={() => handleFilterToggle("categories", cat)}
                className={`text-sm ${
                  selectedFilters.categories.includes(cat)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                {cat === 'FOOD' ? 'Продукты' : 'Не продукты'}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Статус</Label>
          <div className="flex flex-wrap gap-2">
            {uniqueStatuses.map((status) => (
              <Button
                key={status}
                variant={selectedFilters.statuses.includes(status) ? "default" : "outline"}
                onClick={() => handleFilterToggle("statuses", status)}
                className={`text-sm ${
                  selectedFilters.statuses.includes(status)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                {status === 'VACANT' ? 'Свободно' : 'Занято'}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
