'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-xl font-bold"
                    >
                        DMP Booking
                    </Link>

                    {session?.user && (
                        <nav className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Забронировать
                            </Link>
                            <Link
                                href="/bookings"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Мои бронирования
                            </Link>
                            {session.user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Админ панель
                                </Link>
                            )}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <Link
                                href="/profile"
                                className="flex items-center gap-2"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || ''}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        {session.user.name?.[0] || session.user.email?.[0]}
                                    </div>
                                )}
                                <span>{session.user.name || session.user.email}</span>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => signOut()}
                            >
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline">Войти</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Регистрация</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
