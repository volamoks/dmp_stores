"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  zone: {
    uniqueId: string;
    equipment: string;
    store: {
      name: string;
      city: string;
    };
  };
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user) {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        setBookings(data);
      }
    };

    fetchBookings();
  }, [session]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'На рассмотрении';
      case 'APPROVED':
        return 'Подтверждено';
      case 'REJECTED':
        return 'Отклонено';
      default:
        return status;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>
      
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Место</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зона</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Даты</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{booking.zone.store.name}</div>
                      <div className="text-sm text-gray-500">{booking.zone.store.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm">{booking.zone.uniqueId}</div>
                      <div className="text-sm text-gray-500">{booking.zone.equipment}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${getStatusBadgeClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {booking.totalPrice.toLocaleString()} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          У вас пока нет бронирований
        </p>
      )}
    </main>
  );
}
