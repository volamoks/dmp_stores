'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Store } from '../types/store';

interface StoreFiltersProps {
    stores: Store[];
    onFilterChange: (filteredStores: Store[]) => void;
}

export function StoreFilters({ stores, onFilterChange }: StoreFiltersProps) {
    const [selectedCity, setSelectedCity] = useState<string[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const cities = Array.from(new Set(stores.map(store => store.city)));
    const formats = Array.from(new Set(stores.map(store => store.equipmentFormat)));

    useEffect(() => {
        const filteredStores = stores.filter(store => {
            const cityMatch = selectedCity.length === 0 || selectedCity.includes(store.city);
            const formatMatch = selectedFormat.length === 0 || selectedFormat.includes(store.equipmentFormat);
            const nameMatch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            return cityMatch && formatMatch && nameMatch;
        });

        onFilterChange(filteredStores);
    }, [selectedCity, selectedFormat, searchQuery, stores, onFilterChange]);

    const handleFilterChange = (type: 'city' | 'format', value: string) => {
        if (type === 'city') {
            setSelectedCity(prev => 
                prev.includes(value) 
                    ? prev.filter(city => city !== value)
                    : [...prev, value]
            );
        } else {
            setSelectedFormat(prev => 
                prev.includes(value) 
                    ? prev.filter(format => format !== value)
                    : [...prev, value]
            );
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                        className="h-5 w-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Поиск по названию магазина..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Город</h3>
                <div className="flex flex-wrap gap-2">
                    {cities.map(city => (
                        <Button
                            key={city}
                            variant={selectedCity.includes(city) ? "default" : "outline"}
                            onClick={() => handleFilterChange('city', city)}
                            className={`text-sm ${
                                selectedCity.includes(city)
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                        >
                            {city}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Формат</h3>
                <div className="flex flex-wrap gap-2">
                    {formats.map(format => (
                        <Button
                            key={format}
                            variant={selectedFormat.includes(format) ? "default" : "outline"}
                            onClick={() => handleFilterChange('format', format)}
                            className={`text-sm ${
                                selectedFormat.includes(format)
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                        >
                            {format}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
