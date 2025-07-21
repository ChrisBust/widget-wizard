import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  name: string;
  stars: number;
  text: string;
  source: string;
}

export interface IWidget extends Document {
  businessName: string;
  website: string;
  reviews: IReview[];
}

const ReviewSchema: Schema<IReview> = new Schema({
  name: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  source: { type: String, required: true },
});

const WidgetSchema: Schema<IWidget> = new Schema(
  {
    businessName: {
      type: String,
      required: [true, 'Please provide a business name.'],
      maxlength: [60, 'Business name cannot be more than 60 characters'],
    },
    website: {
      type: String,
      required: [true, 'Please provide a website URL.'],
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid URL.'],
    },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

const Widget: Model<IWidget> = mongoose.models.Widget || mongoose.model<IWidget>('Widget', WidgetSchema);

export default Widget;
