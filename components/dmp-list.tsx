'use client';

import { useState } from 'react';
import { DMP } from '../types/store';
import BookingModal from './booking-modal';
import { MonthButton } from './month-button';
import { SpotFilters, SpotFilters as SpotFiltersType } from './spot-filters';
import { Button } from './ui/button';

interface DMPListProps {
    dmpList: DMP[];
}

export default function DMPList({ dmpList }: DMPListProps) {
    const [selectedDMP, setSelectedDMP] = useState<DMP | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [filteredDMPs, setFilteredDMPs] = useState(dmpList);
    const [monthOffset, setMonthOffset] = useState(0);

    const currentDate = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        return date.toISOString().slice(0, 7);
    });

    const handleSpotFilterChange = (filters: SpotFiltersType) => {
        const filtered = dmpList.filter(dmp => {
            return (
                (filters.equipment.length === 0 || filters.equipment.includes(dmp.equipment)) &&
                (filters.categories.length === 0 || filters.categories.includes(dmp.category)) &&
                (filters.statuses.length === 0 || filters.statuses.includes(dmp.status))
            );
        });
        setFilteredDMPs(filtered);
    };

    const visibleMonths = months.slice(monthOffset, monthOffset + 6);

    return (
        <div className="mt-4 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Список ДМП
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        Найдено: {filteredDMPs.length}
                    </span>
                </h3>
                <SpotFilters dmpList={dmpList} onFilterChange={handleSpotFilterChange} />
            </div>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Назначение
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Оборудование
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Категория
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Статус
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-between">
                                    <span>Доступность</span>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
                                            variant="outline"
                                            className="p-1 h-6 w-6"
                                            disabled={monthOffset === 0}
                                        >
                                            ←
                                        </Button>
                                        <Button
                                            onClick={() => setMonthOffset(Math.min(6, monthOffset + 1))}
                                            variant="outline"
                                            className="p-1 h-6 w-6"
                                            disabled={monthOffset >= 6}
                                        >
                                            →
                                        </Button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDMPs.map(dmp => (
                            <tr key={dmp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {dmp.purpose}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dmp.equipment}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dmp.category === 'FOOD' ? 'Продукты' : 'Не продукты'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        dmp.status === 'VACANT' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {dmp.status === 'VACANT' ? 'Свободно' : 'Занято'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {visibleMonths.map(month => (
                                            <MonthButton
                                                key={month}
                                                month={month}
                                                isAvailable={dmp.status === 'VACANT'}
                                                onClick={() => {
                                                    setSelectedDMP(dmp);
                                                    setSelectedMonth(month);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedDMP && selectedMonth && (
                <BookingModal
                    dmp={selectedDMP}
                    month={selectedMonth}
                    onClose={() => {
                        setSelectedDMP(null);
                        setSelectedMonth(null);
                    }}
                />
            )}
        </div>
    );
}
