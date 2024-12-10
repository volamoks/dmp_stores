'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import LoginForm from '../components/login-form';
import StoreList from '../components/store-list';
import { Button } from '../components/ui/button';
import { Store } from '../types/store';

export default function Home() {
    const { user, logout } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStores() {
            try {
                const response = await fetch('/api/stores');
                if (!response.ok) throw new Error('Failed to fetch stores');
                const data = await response.json();
                setStores(data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchStores();
        }
    }, [user]);

    return (
        <main className="min-h-screen bg-gray-50">
            {user ? (
                <>
                    <div className="bg-white border-b border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-xl font-medium text-gray-900">
                                        Управление ДМП
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {user.name}
                                    </p>
                                </div>
                                <Button 
                                    onClick={logout}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    Выйти
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="container mx-auto px-4 py-8">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="h-48 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <StoreList stores={stores} />
                    )}
                </>
            ) : (
                <LoginForm />
            )}
        </main>
    );
}
