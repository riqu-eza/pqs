import { User } from '../Models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/auth';

export const registerUser = async (data) => {
  const { name, email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { user, token };
};
