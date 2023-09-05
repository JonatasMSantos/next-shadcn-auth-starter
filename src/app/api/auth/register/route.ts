import { db as prisma } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "../../exceptions/errors";

import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, email, password } = data;

  try {
    await validate(data);
    let user = await createUser(data);

    return NextResponse.json(user);
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return NextResponse.json(err.msg, err.data);
    } else {
      return NextResponse.json(
        {
          error:
            "An internal error has occurred. Please try again later: " +
            JSON.stringify(err),
        },
        { status: 500 }
      );
    }
  }
}

async function validate(data: any) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new ValidationError("Name, email and password is required", {
      status: 400,
    });
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExists) {
    throw new ValidationError("E-mail já existe", {
      status: 400,
    });
  }
}

async function createUser(data: any) {
  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return user;
}
