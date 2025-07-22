import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  user: string;
  password: string;
}

const UserSchema: Schema<IUser> = new Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
