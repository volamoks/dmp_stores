'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          Пожалуйста, войдите в систему для просмотра профиля
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>
      
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Личная информация</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500">Имя</label>
              <div className="mt-1 text-gray-900">{session.user.name || 'Не указано'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-gray-900">{session.user.email}</div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="border-t border-gray-200"></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Информация об аккаунте</h2>
          <div>
            <label className="block text-sm font-medium text-gray-500">Статус аккаунта</label>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Активный
              </span>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
