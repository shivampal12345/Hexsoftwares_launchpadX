import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import dbConnect from './db';
import User from '@/models/User';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? undefined : 'development-only-secret');
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

// Generate JWT token
export const generateToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE as SignOptions['expiresIn'],
  };

  return jwt.sign({ id }, JWT_SECRET, {
    ...options,
  });
};

// Get current user from token
export const getCurrentUser = async (request: Request) => {
  // Get token from cookies in request headers
  const cookieHeader = request.headers.get('cookie');
  const tokenCookie = cookieHeader?.split('; ').find(row => row.startsWith('token='));
  const token = tokenCookie?.split('=')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await dbConnect();
    const user = await User.findById(decoded.id);
    return user;
  } catch {
    return null;
  }
};
