'use client';

import { useState } from 'react';
import { Store } from '../types/store';
import StoreCard from './store-card';
import { StoreFilters } from './store-filters';

interface StoreListProps {
    stores: Store[];
}

export default function StoreList({ stores }: StoreListProps) {
    const [filteredStores, setFilteredStores] = useState(stores);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Магазины
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            Найдено: {filteredStores.length}
                        </span>
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Выберите магазин для просмотра доступных ДМП зон
                    </p>
                </div>

                <StoreFilters 
                    stores={stores} 
                    onFilterChange={setFilteredStores} 
                />
            </div>

            {filteredStores.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Магазины не найдены</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Попробуйте изменить параметры фильтрации
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}
        </div>
    );
}
