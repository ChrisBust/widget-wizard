'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import dbConnect from './mongodb';
import Widget from '@/models/widget';

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
    
    // Revalidate all necessary paths
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/test`);
    revalidatePath(`/widget/${widgetId}`);
    
    return { message: 'Thank you for your review!' };

  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to add review.' };
  }
}

export async function deleteReview(widgetId: string, reviewId: string) {
  try {
    await dbConnect();
    
    await Widget.findByIdAndUpdate(widgetId, {
      $pull: { reviews: { _id: reviewId } },
    });

    revalidatePath('/dashboard');
    revalidatePath(`/widget/${widgetId}`);
    revalidatePath(`/dashboard/test`);
    
    return { success: true, message: 'Review deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { success: false, message: 'Database Error: Failed to delete review.' };
  }
}

const reviewSchema = z.object({
  User: z.string(),
  Rate: z.number().min(1).max(5),
  commentary: z.string(),
});

const ImportReviewsSchema = z.object({
  widgetId: z.string().min(1, { message: 'Please select a widget.' }),
  reviewSource: z.string().min(1, { message: 'Please provide the review source.' }),
  reviewsJson: z.string().min(1, { message: 'Please provide the reviews JSON.' }),
});

export type ImportState = {
  errors?: {
    widgetId?: string[];
    reviewSource?: string[];
    reviewsJson?: string[];
  };
  message?: string | null;
  importedCount?: number;
};

export async function importReviews(prevState: ImportState, formData: FormData): Promise<ImportState> {
  const validatedFields = ImportReviewsSchema.safeParse({
    widgetId: formData.get('widgetId'),
    reviewSource: formData.get('reviewSource'),
    reviewsJson: formData.get('reviewsJson'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data. Please check your inputs.',
    };
  }

  const { widgetId, reviewSource, reviewsJson } = validatedFields.data;

  try {
    await dbConnect();
    const widget = await Widget.findById(widgetId);
    if (!widget) {
      return { message: 'Widget not found.' };
    }

    let parsedReviews;
    try {
      parsedReviews = JSON.parse(reviewsJson);
    } catch (e) {
      return {
        message: 'Invalid JSON format. Please check your input.',
        errors: { reviewsJson: ['Invalid JSON format.'] },
      };
    }

    const validatedReviews = z.array(reviewSchema).safeParse(parsedReviews);
    if (!validatedReviews.success) {
      return {
        message: 'JSON structure is incorrect. Please ensure it is an array of reviews with "User", "Rate", and "commentary" fields.',
        errors: { reviewsJson: ['Incorrect JSON structure.'] },
      };
    }

    const newReviews = validatedReviews.data.map(review => ({
      name: review.User,
      stars: review.Rate,
      text: review.commentary,
      source: reviewSource,
    }));

    widget.reviews.push(...newReviews);
    await widget.save();
    
    revalidatePath('/dashboard');
    revalidatePath(`/widget/${widgetId}`);
    revalidatePath(`/dashboard/test`);

    return {
      message: `Successfully imported ${newReviews.length} review(s).`,
      importedCount: newReviews.length,
    };

  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'An error occurred during the import process.' };
  }
}
