import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";

export async function signupUser({ email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("EMAIL_ALREADY_EXISTS");
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: null,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
}
