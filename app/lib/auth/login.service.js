import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("INVALID_CREDENTIALS");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("INVALID_CREDENTIALS");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    role : user.role,
  };
}
