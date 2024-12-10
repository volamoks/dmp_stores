// api/stores/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Booking } from '@prisma/client';

function determineZoneStatus(bookings: Booking[]): 'Свободен' | 'Занят' {
    // If there are no bookings, the spot is free
    if (!bookings || bookings.length === 0) {
        return 'Свободен';
    }
    // If there are any bookings, the spot is occupied
    return 'Занят';
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '15');
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalStores = await prisma.store.count();

        // Get paginated stores with zones and their bookings
        const stores = await prisma.store.findMany({
            include: {
                dmpZones: {
                    include: {
                        bookings: true,
                    },
                },
            },
            orderBy: {
                id: 'asc'
            },
            skip,
            take: limit,
        });

        // Transform the data to include calculated status
        const transformedStores = stores.map(store => ({
            ...store,
            dmpZones: store.dmpZones.map(zone => ({
                id: zone.id,
                uniqueId: zone.uniqueId,
                zoneId: zone.zoneId,
                equipment: zone.equipment,
                dmpProductNeighboring: zone.dmpProductNeighboring,
                purpose: zone.purpose,
                subPurpose: zone.subPurpose,
                category: zone.category,
                supplier: zone.supplier,
                brand: zone.brand,
                productCategory: zone.productCategory,
                storeId: zone.storeId,
                comment: zone.comment,
                price: zone.price,
                createdAt: zone.createdAt,
                updatedAt: zone.updatedAt,
                status: determineZoneStatus(zone.bookings)
            }))
        }));

        return NextResponse.json({
            stores: transformedStores,
            pagination: {
                total: totalStores,
                page,
                limit,
                totalPages: Math.ceil(totalStores / limit)
            }
        });
    } catch (error) {
        console.error('Detailed error:', error);

        if (error instanceof PrismaClientKnownRequestError) {
            return NextResponse.json(
                {
                    error: 'Database error',
                    code: error.code,
                    message: error.message,
                },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                error: 'Server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 },
        );
    }
}
