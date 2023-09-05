import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcrypt";

import { User } from "@prisma/client";
import { ValidationError } from "../../exceptions/errors";
import { getJwtSecretKey } from "@/lib/jwt";

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const user = await validateCredentials(body);
    return NextResponse.json({ ok: true, data: user });
  } catch (err: any | null) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ ok: false, error: err.msg }, err.data);
    } else {
      return NextResponse.json(
        {
          ok: false,
          error:
            "An internal error has occurred. Please try again later: " +
            JSON.stringify(err),
        },
        { status: 500 }
      );
    }
  }
}

async function validateCredentials(credentials: any) {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new ValidationError("Email and password is required", {
      status: 401,
    });
  }

  const user: User | null = await prisma.user.findUnique({
    where: {
      email: username,
    },
  });

  if (!user || !user.hashedPassword) {
    throw new ValidationError("User not found whith this credentials.", {
      status: 401,
    });
  }

  const matchPassword = await bcrypt.compare(password, user.hashedPassword);

  if (!matchPassword) {
    throw new ValidationError("Email or password is incorrect.", {
      status: 401,
    });
  }

  const { hashedPassword, ...userWhitoutPass } = user;

  const accessToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(getJwtSecretKey()));

  const result = {
    ...userWhitoutPass,
    accessToken,
  };

  return result;
}
