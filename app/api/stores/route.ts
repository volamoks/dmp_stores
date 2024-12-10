// api/stores/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET() {
    try {
        const stores = await prisma.store.findMany({
            include: {
                dmpZones: {
                    include: {
                        bookings: true,
                    },
                },
            },
        });

        return NextResponse.json(stores);
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
