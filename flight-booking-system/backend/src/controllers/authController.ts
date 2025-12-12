import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JWT_CONFIG, HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';

const generateToken = (userId: string): string => {
  const secret: jwt.Secret = JWT_CONFIG.SECRET;
  
  return jwt.sign({ userId }, secret, { 
    // Cast explicitly to the type defined by the library
    expiresIn: JWT_CONFIG.EXPIRY as jwt.SignOptions['expiresIn'] 
  });
};
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user._id.toString());
    logger.info(`✅ User registered: ${email}`);

    res.status(HTTP_STATUS.CREATED).json({
      token,
      user: { _id: user._id, email: user.email, name: user.name, walletBalance: user.walletBalance },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    logger.info(`✅ User logged in: ${email}`);

    res.json({
      token,
      user: { _id: user._id, email: user.email, name: user.name, walletBalance: user.walletBalance },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: (error as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    }
    res.json({ _id: user._id, email: user.email, name: user.name, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};
