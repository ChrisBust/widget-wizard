'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import dbConnect, { seedUser } from './mongodb';
import Widget from '@/models/widget';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from './session';


const CreateWidgetSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type State = {
  errors?: {
    businessName?: string[];
    website?: string[];
  };
  message?: string | null;
};

export async function createWidget(prevState: State, formData: FormData) {
  const validatedFields = CreateWidgetSchema.safeParse({
    businessName: formData.get('businessName'),
    website: formData.get('website'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create widget. Please check the fields.',
    };
  }

  const { businessName, website } = validatedFields.data;

  try {
    await dbConnect();

    const newWidget = new Widget({
      businessName,
      website,
      reviews: [], // Start with an empty reviews array
    });

    await newWidget.save();
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to create widget.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteWidget(id: string) {
  if (!id) {
    throw new Error('ID is required to delete a widget.');
  }

  try {
    await dbConnect();
    await Widget.findByIdAndDelete(id);
    revalidatePath('/dashboard');
    return { message: 'Widget deleted successfully.' };
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to delete widget.' };
  }
}

const AddReviewSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  stars: z.coerce.number().min(1, 'Please select a star rating.').max(5),
  text: z.string().min(10, { message: 'Review must be at least 10 characters.' }),
  source: z.string().optional(),
});

export type AddReviewState = {
  errors?: {
    name?: string[];
    stars?: string[];
    text?: string[];
    source?: string[];
  };
  message?: string | null;
}

export async function addReview(widgetId: string, prevState: AddReviewState, formData: FormData) {
  const validatedFields = AddReviewSchema.safeParse({
    name: formData.get('name'),
    stars: formData.get('stars'),
    text: formData.get('text'),
    source: formData.get('source'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to submit review. Please check the fields.',
    };
  }

  const { name, stars, text, source } = validatedFields.data;

  try {
    await dbConnect();

    const widget = await Widget.findById(widgetId);

    if (!widget) {
      return { message: 'Widget not found.' };
    }

    widget.reviews.push({
      name,
      stars,
      text,
      source: source || 'Direct',
    });

    await widget.save();
    
    revalidatePath('/dashboard');
    revalidatePath(`/widget/${widgetId}`);
    return { message: 'Thank you for your review!' };

  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to add review.' };
  }
}

const LoginSchema = z.object({
  user: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const sessionCookieName = 'session';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return 'Invalid form data.';
    }

    const { user: username, password } = validatedFields.data;

    await dbConnect();
    await seedUser(); // Ensure the default user exists
    
    const user = await User.findOne({ user: username }).select('+password');

    if (!user || !user.password) {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return 'Invalid credentials.';
    }

    const session = { userId: user._id.toString(), username: user.user };
    const sessionToken = await encrypt({ session, expires: new Date(Date.now() + 60 * 60 * 1000) });

    cookies().set(sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

  } catch (error) {
    console.error(error)
    return 'An unexpected error occurred.';
  }

  redirect('/dashboard');
}
