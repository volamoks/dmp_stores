'use client';

import { Store } from '../types/store';
import DMPList from './dmp-list';

interface DMPModalProps {
    store: Store;
    onClose: () => void;
}

export default function DMPModal({ store, onClose }: DMPModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-gray-900">
                            {store.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {store.city} • {store.equipmentFormat}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    <DMPList dmpList={store.dmpZones} />
                </div>
            </div>
        </div>
    );
}
