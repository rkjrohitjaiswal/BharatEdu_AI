import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'teacher' | 'parent';
export type PreferredLanguage = 'english' | 'hindi' | 'gujarati';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  preferredLanguage: PreferredLanguage;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): SafeUser;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: PreferredLanguage;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Excluded from query results by default
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'teacher', 'parent'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
    preferredLanguage: {
      type: String,
      enum: {
        values: ['english', 'hindi', 'gujarati'],
        message: '{VALUE} is not a supported language',
      },
      default: 'english',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return user object without passwordHash
UserSchema.methods.toSafeObject = function (): SafeUser {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    preferredLanguage: this.preferredLanguage,
    profileImage: this.profileImage,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
