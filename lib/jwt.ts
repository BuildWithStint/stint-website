import jwt from 'jsonwebtoken';
import { IUser } from './models/User';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isSuperUser: boolean;
}

export const generateTokens = (user: IUser) => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    isSuperUser: user.isSuperUser ?? (user.email === 'admin@stint.com') // Fallback for admin@stint.com
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: '30m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
};