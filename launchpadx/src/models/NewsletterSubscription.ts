import { Schema, model, models } from 'mongoose';

const NewsletterSubscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        'Please add a valid email',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const NewsletterSubscription =
  models.NewsletterSubscription ||
  model('NewsletterSubscription', NewsletterSubscriptionSchema);

export default NewsletterSubscription;
