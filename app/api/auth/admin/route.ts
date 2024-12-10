import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, adminSecret } = await req.json();

    if (!name || !email || !password || !adminSecret) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify admin secret
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: "admin",
      },
    });

    // Remove password from response
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      { message: "Admin user created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "Error creating admin user" },
      { status: 500 }
    );
  }
}
