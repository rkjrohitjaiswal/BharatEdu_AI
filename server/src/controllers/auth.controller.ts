import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, UserRole, PreferredLanguage, SafeUser } from '../models/user.model.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { isDBConnected } from '../services/db.js';

interface InMemUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  preferredLanguage: PreferredLanguage;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory fallback store when MongoDB is offline
const inMemUsersById = new Map<string, InMemUser>();
const inMemUsersByEmail = new Map<string, InMemUser>();

export const getInMemUserById = (id: string): InMemUser | null => inMemUsersById.get(id) || null;
export const getInMemStudents = (): InMemUser[] =>
  Array.from(inMemUsersById.values()).filter((u) => u.role === 'student');

const getJwtSecret = (): string => process.env.JWT_SECRET || 'bharatedu_jwt_secret_dev_key';

const toSafeUser = (u: any): SafeUser => ({
  id: u.id || (u._id ? u._id.toString() : String(Date.now())),
  name: u.name,
  email: u.email,
  role: u.role,
  preferredLanguage: u.preferredLanguage,
  profileImage: u.profileImage || '',
  isActive: u.isActive ?? true,
  createdAt: u.createdAt || new Date(),
  updatedAt: u.updatedAt || new Date(),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, preferredLanguage } = req.body;

    // Field Validations
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Name is required' });
      return;
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({ success: false, message: 'A valid email address is required' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      return;
    }

    const userRole: UserRole = role === 'teacher' ? 'teacher' : role === 'parent' ? 'parent' : 'student';
    const lang: PreferredLanguage = ['english', 'hindi', 'gujarati'].includes(preferredLanguage)
      ? preferredLanguage
      : 'english';

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    if (isDBConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Email is already registered' });
        return;
      }
    } else {
      if (inMemUsersByEmail.has(normalizedEmail)) {
        res.status(400).json({ success: false, message: 'Email is already registered' });
        return;
      }
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let safeUser: SafeUser;

    if (isDBConnected()) {
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: userRole,
        preferredLanguage: lang,
      });
      await newUser.save();
      safeUser = newUser.toSafeObject();
    } else {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const now = new Date();
      const inMemUser: InMemUser = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: userRole,
        preferredLanguage: lang,
        profileImage: '',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      inMemUsersById.set(id, inMemUser);
      inMemUsersByEmail.set(normalizedEmail, inMemUser);
      safeUser = toSafeUser(inMemUser);
    }

    // Sign JWT
    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
        preferredLanguage: safeUser.preferredLanguage,
      },
      getJwtSecret(),
      signOptions
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let userRecord: { passwordHash: string; isActive: boolean } & SafeUser;

    if (isDBConnected()) {
      const dbUser = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
      if (!dbUser) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
      userRecord = {
        ...dbUser.toSafeObject(),
        passwordHash: dbUser.passwordHash,
        isActive: dbUser.isActive,
      };
    } else {
      const memUser = inMemUsersByEmail.get(normalizedEmail);
      if (!memUser) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
      userRecord = {
        ...toSafeUser(memUser),
        passwordHash: memUser.passwordHash,
        isActive: memUser.isActive,
      };
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (!userRecord.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const safeUser: SafeUser = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      preferredLanguage: userRecord.preferredLanguage,
      profileImage: userRecord.profileImage,
      isActive: userRecord.isActive,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    };

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
        preferredLanguage: safeUser.preferredLanguage,
      },
      getJwtSecret(),
      signOptions
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let safeUser: SafeUser | null = null;

    if (isDBConnected()) {
      const dbUser = await User.findById(req.user.id);
      if (dbUser) {
        safeUser = dbUser.toSafeObject();
      }
    } else {
      const memUser = inMemUsersById.get(req.user.id);
      if (memUser) {
        safeUser = toSafeUser(memUser);
      } else {
        // Fallback to token payload if user registered before server restart
        safeUser = {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          preferredLanguage: req.user.preferredLanguage,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    if (!safeUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
