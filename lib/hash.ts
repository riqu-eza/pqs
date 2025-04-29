// /lib/hash.ts
import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword);
};
