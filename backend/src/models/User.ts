import mongoose, { Document, Schema } from 'mongoose';

export type Role = 'verifier' | 'admin';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['verifier', 'admin'],
      default: 'verifier',
    },
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>('User', UserSchema);
export default User;
