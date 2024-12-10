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

type SortField = 'price' | 'status' | 'category' | 'purpose';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE_OPTIONS = [15, 30, 50, 100];

export default function DMPList({ dmpList }: DMPListProps) {
    const [selectedDMP, setSelectedDMP] = useState<DMP | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [filteredDMPs, setFilteredDMPs] = useState(dmpList);
    const [monthOffset, setMonthOffset] = useState(0);
    const [sortField, setSortField] = useState<SortField>('price');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const currentDate = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        return date.toISOString().slice(0, 7);
    });

    const totalPages = Math.ceil(filteredDMPs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredDMPs.slice(startIndex, endIndex);

    const sortDMPs = (dmps: DMP[], field: SortField, direction: SortDirection) => {
        return [...dmps].sort((a, b) => {
            let comparison = 0;

            switch (field) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'purpose':
                    comparison = a.purpose.localeCompare(b.purpose);
                    break;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    };

    const handleSort = (field: SortField) => {
        const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        setFilteredDMPs(sortDMPs(filteredDMPs, field, newDirection));
        setCurrentPage(1);
    };

    const handleSpotFilterChange = (filters: SpotFiltersType) => {
        const filtered = dmpList.filter(dmp => {
            const priceCondition = filters.maxPrice ? dmp.price <= filters.maxPrice : true;
            const statusCondition =
                filters.statuses.length === 0 || filters.statuses.includes(dmp.status);
            const searchCondition =
                !filters.searchTerm ||
                dmp.equipment.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                dmp.productCategory.toLowerCase().includes(filters.searchTerm.toLowerCase());

            return priceCondition && statusCondition && searchCondition;
        });

        setFilteredDMPs(sortDMPs(filtered, sortField, sortDirection));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const getSortIcon = (field: SortField) => {
        if (field !== sortField) return '↕';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const visibleMonths = months.slice(monthOffset, monthOffset + 6);

    const handleMonthClick = (dmp: DMP, month: string) => {
        if (dmp.status === 'Свободен') {
            if (selectedDMP && selectedDMP.id !== dmp.id) {
                // If selecting a different DMP, clear previous selections
                setSelectedMonths([month]);
            } else {
                // Toggle month selection for the same DMP
                setSelectedMonths(prev =>
                    prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month].sort(),
                );
            }
            setSelectedDMP(dmp);
        }
    };

    const calculateTotalPrice = () => {
        if (!selectedDMP) return 0;
        return selectedDMP.price * selectedMonths.length;
    };

    const handleBookingClick = () => {
        if (selectedDMP && selectedMonths.length > 0) {
            setShowBookingModal(true);
        }
    };

    const handleBookingClose = () => {
        setShowBookingModal(false);
        setSelectedDMP(null);
        setSelectedMonths([]);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Свободен':
                return 'bg-green-100 text-green-800';
            case 'Занят':
                return 'bg-red-100 text-red-800';
            case 'В ожидании':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        return status; // Status is already in Russian
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Список ДМП
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            Показано: {filteredDMPs.length} из {dmpList.length}
                        </span>
                    </h3>
                    {selectedDMP && selectedMonths.length > 0 && (
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-gray-900">
                                Итого:{' '}
                                {new Intl.NumberFormat('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                }).format(calculateTotalPrice())}
                            </span>
                            <Button
                                onClick={() => {
                                    setSelectedDMP(null);
                                    setSelectedMonths([]);
                                }}
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                            >
                                Очистить
                            </Button>
                            <Button
                                onClick={handleBookingClick}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Забронировать
                            </Button>
                        </div>
                    )}
                </div>
                <SpotFilters
                    dmpList={dmpList}
                    onFilterChange={handleSpotFilterChange}
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* <th
                                scope="col"
                                className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('purpose')}
                            >
                                Назначение {getSortIcon('purpose')}
                            </th> */}
                            <th
                                scope="col"
                                className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Оборудование
                            </th>
                            <th
                                scope="col"
                                className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('category')}
                            >
                                Категория {getSortIcon('category')}
                            </th>
                            {/* <th
                                scope="col"
                                className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('status')}
                            >
                                Статус {getSortIcon('status')}
                            </th> */}
                            <th
                                scope="col"
                                className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Зона
                            </th>
                            <th
                                scope="col"
                                className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('price')}
                            >
                                Цена {getSortIcon('price')}
                            </th>
                            <th
                                scope="col"
                                className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                <div className="flex items-center justify-between">
                                    <span>Доступность</span>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={() =>
                                                setMonthOffset(Math.max(0, monthOffset - 1))
                                            }
                                            variant="outline"
                                            className="p-1 h-6 w-6"
                                            disabled={monthOffset === 0}
                                        >
                                            ←
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setMonthOffset(Math.min(6, monthOffset + 1))
                                            }
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
                        {currentItems.map(dmp => (
                            <tr
                                key={dmp.id}
                                className={`${
                                    dmp.status === 'Свободен' ? 'hover:bg-gray-50' : ''
                                } transition-colors`}
                            >
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
                                    {dmp.purpose}
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                                    {dmp.equipment}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dmp.category === 'FOOD' ? 'Продукты' : 'Не продукты'}
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                                            dmp.status,
                                        )}`}
                                    >
                                        {getStatusText(dmp.status)}
                                    </span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dmp.zoneId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Intl.NumberFormat('ru-RU', {
                                        style: 'currency',
                                        currency: 'RUB',
                                    }).format(dmp.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-nowrap gap-1 overflow-x-auto">
                                        {visibleMonths.map(month => (
                                            <MonthButton
                                                key={month}
                                                month={month}
                                                isAvailable={dmp.status === 'Свободен'}
                                                isPending={dmp.status === 'В ожидании'}
                                                isSelected={
                                                    selectedMonths.includes(month) &&
                                                    selectedDMP?.id === dmp.id
                                                }
                                                onClick={() => handleMonthClick(dmp, month)}
                                            />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-700">Показывать по:</span>
                    <select
                        value={itemsPerPage}
                        onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md text-sm p-1"
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="px-3 py-1"
                    >
                        ←
                    </Button>
                    <span className="text-sm text-gray-700">
                        Страница {currentPage} из {totalPages}
                    </span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="px-3 py-1"
                    >
                        →
                    </Button>
                </div>
            </div>

            {showBookingModal && selectedDMP && selectedMonths.length > 0 && (
                <BookingModal
                    dmp={selectedDMP}
                    months={selectedMonths}
                    onClose={handleBookingClose}
                />
            )}
        </div>
    );
}
