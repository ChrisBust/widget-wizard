
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/user';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export async function seedUser() {
  try {
    await dbConnect(); // Ensure DB is connected before seeding
    const existingUser = await User.findOne({ user: 'ChristopherB421' });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('BusChris24', salt);
      await User.create({ user: 'ChristopherB421', password: hashedPassword });
      console.log('Default user created.');
    } else {
        // If user exists, but password is not hashed, hash it.
        // This is for migration from the unhashed password in the DB.
        const isHashed = existingUser.password && (existingUser.password.startsWith('$2a$') || existingUser.password.startsWith('$2b$'));
        if (!isHashed) {
            console.log("Password for default user is not hashed. Hashing now...");
            // Si la contraseña está vacía o undefined, asigna la por defecto
            if (!existingUser.password) {
                existingUser.password = 'BusChris24';
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(existingUser.password, salt);
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log("Password has been hashed and updated.");
        }
    }
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}

// Call seeding once, e.g., in a script or a specific startup file, not here.
// seedUser(); 

export default dbConnect;
