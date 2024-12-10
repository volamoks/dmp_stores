"use client";

import { User } from "@prisma/client";
import { Card, CardHeader, CardContent } from "./ui/card";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name || ""} 
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Роль</label>
              <p className="font-medium">{user.role}</p>
            </div>
            {user.phone && (
              <div>
                <label className="text-sm text-gray-500">Телефон</label>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-500">Дата регистрации</label>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Последнее обновление</label>
              <p className="font-medium">
                {new Date(user.updatedAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
