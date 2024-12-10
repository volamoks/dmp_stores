import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface WhereClause {
  status?: string;
  userId?: number;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const whereClause: WhereClause = {};

    // If user is admin and status filter is provided, filter by status
    if (user.role === 'admin' && status) {
      whereClause.status = status;
    } 
    // If regular user, show only their bookings
    else if (user.role !== 'admin') {
      whereClause.userId = user.id;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        zone: {
          include: {
            store: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { zoneId, startDate, endDate, totalPrice } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        zoneId,
        userId: user.id,
        startDate,
        endDate,
        totalPrice,
        status: "PENDING", // All new bookings start as pending
      },
      include: {
        zone: {
          include: {
            store: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
