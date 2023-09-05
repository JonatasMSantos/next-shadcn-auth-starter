import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { User } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  if (!params.email) {
    return null;
  }

  const user: User | null = await prisma.user.findUnique({
    where: {
      email: params.email,
    },
  });

  return NextResponse.json({ id: params.email }, { status: 200 });
}
