'use client';

import { useState } from 'react';
import { Store } from '../types/store';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import DMPModal from './dmp-modal';

interface StoreCardProps {
    store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
    const [showDMPModal, setShowDMPModal] = useState(false);
    const availableDMPCount = store.dmpZones.filter(dmp => dmp.status === 'Свободен').length;
    
    return (
        <>
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold font-lg text text-gray-900 group-hover:text-red-600 transition-colors">
                                {store.name}
                            </h3>
                            <h2 className="text-medium font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {store.externalId}
                            </h2>
                        </div>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            {availableDMPCount} ДМП
                        </span>
                    </div>
                    <div></div>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <span>{store.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            <span>{store.newFormat}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button
                            onClick={() => setShowDMPModal(true)}
                            variant="outline"
                            className="text-sm w-auto px-4 py-1"
                        >
                            Показать ДМП
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showDMPModal && (
                <DMPModal
                    store={store}
                    onClose={() => setShowDMPModal(false)}
                />
            )}
        </>
    );
}
