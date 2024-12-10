import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== 'admin') {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['APPROVED', 'REJECTED', 'BOOKED'].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Only allow transition to BOOKED if current status is APPROVED
    if (status === 'BOOKED') {
      const currentBooking = await prisma.booking.findUnique({
        where: { id: parseInt(params.bookingId) },
      });
      
      if (currentBooking?.status !== 'APPROVED') {
        return new NextResponse("Can only change to BOOKED from APPROVED status", { status: 400 });
      }
    }

    const booking = await prisma.booking.update({
      where: {
        id: parseInt(params.bookingId),
      },
      data: {
        status,
      },
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
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
