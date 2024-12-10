"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  user: {
    name: string;
    email: string;
  };
  zone: {
    uniqueId: string;
    equipment: string;
    store: {
      name: string;
      city: string;
    };
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED'>('PENDING');

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.role === 'admin') {
        const response = await fetch(`/api/bookings?status=${activeTab}`);
        const data = await response.json();
        setBookings(data);
      }
    };

    fetchBookings();
  }, [session, activeTab]);

  const handleBookingAction = async (bookingId: number, action: 'APPROVED' | 'REJECTED' | 'BOOKED') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (session?.user?.role !== 'admin') {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
          Доступ запрещен. Эта страница доступна только администраторам.
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
      
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveTab('PENDING')}
          variant={activeTab === 'PENDING' ? "default" : "outline"}
        >
          На рассмотрении
        </Button>
        <Button
          onClick={() => setActiveTab('APPROVED')}
          variant={activeTab === 'APPROVED' ? "default" : "outline"}
        >
          Подтвержденные
        </Button>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{booking.zone.store.name}</h3>
                <p className="text-sm text-gray-600">{booking.zone.store.city}</p>
                <p className="text-sm text-gray-600">Зона: {booking.zone.uniqueId}</p>
                <p className="text-sm text-gray-600">Оборудование: {booking.zone.equipment}</p>
                <div className="mt-2">
                  <p className="text-sm">Пользователь: {booking.user.name}</p>
                  <p className="text-sm text-gray-600">{booking.user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  activeTab === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {activeTab === 'PENDING' ? 'На рассмотрении' : 'Подтверждено'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm">
                <p>С {new Date(booking.startDate).toLocaleDateString()}</p>
                <p>По {new Date(booking.endDate).toLocaleDateString()}</p>
              </div>
              <p className="font-semibold">{booking.totalPrice.toLocaleString()} ₽</p>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              {activeTab === 'PENDING' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Отклонить
                  </Button>
                  <Button
                    onClick={() => handleBookingAction(booking.id, 'APPROVED')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Подтвердить
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleBookingAction(booking.id, 'BOOKED')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Забронировать
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {bookings.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {activeTab === 'PENDING' 
              ? 'Нет бронирований на рассмотрении'
              : 'Нет подтвержденных бронирований'
            }
          </p>
        )}
      </div>
    </main>
  );
}
