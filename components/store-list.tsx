'use client';

import { useState, useEffect } from 'react';
import { Store } from '../types/store';
import StoreCard from './store-card';
import { StoreFilters } from './store-filters';
import { Button } from './ui/button';

interface StoreListProps {
    stores: Store[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (limit: number) => void;
    currentPage: number;
    itemsPerPage: number;
    isLoading: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [15, 25, 50, 100];

export default function StoreList({ 
    stores, 
    pagination, 
    onPageChange, 
    onItemsPerPageChange,
    currentPage,
    itemsPerPage,
    isLoading
}: StoreListProps) {
    const [filteredStores, setFilteredStores] = useState(stores);

    useEffect(() => {
        setFilteredStores(stores);
    }, [stores]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Магазины
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            Найдено: {pagination.total}
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

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            ) : filteredStores.length === 0 ? (
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {filteredStores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-700">Показывать по:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="border border-gray-300 rounded-md text-sm p-1"
                                disabled={isLoading}
                            >
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                variant="outline"
                                className="px-3 py-1"
                            >
                                ←
                            </Button>
                            <span className="text-sm text-gray-700">
                                Страница {currentPage} из {pagination.totalPages}
                            </span>
                            <Button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages || isLoading}
                                variant="outline"
                                className="px-3 py-1"
                            >
                                →
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
