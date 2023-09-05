import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  return NextResponse.json({ id: params.id }, { status: 200 });
}
