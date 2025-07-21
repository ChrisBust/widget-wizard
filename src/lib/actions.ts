'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import dbConnect from './mongodb';
import Widget from '@/models/widget';
import { generateDummyReviews } from '@/ai/flows/generate-dummy-reviews';

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

    const reviews = await generateDummyReviews({ businessName, website });

    const newWidget = new Widget({
      businessName,
      website,
      reviews,
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
