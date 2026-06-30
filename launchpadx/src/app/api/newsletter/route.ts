import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/NewsletterSubscription';

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  let email = '';

  try {
    await dbConnect();
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    email = parsed.data.email.trim().toLowerCase();
    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      return NextResponse.json({
        data: {
          email,
          alreadySubscribed: true,
          subscribedAt: existingSubscription.createdAt,
        },
      });
    }

    const subscription = await NewsletterSubscription.create({ email });

    return NextResponse.json(
      {
        data: {
          email,
          alreadySubscribed: false,
          subscribedAt: subscription.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json({
        data: {
          email,
          alreadySubscribed: true,
          subscribedAt: new Date().toISOString(),
        },
      });
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe newsletter email.' },
      { status: 500 }
    );
  }
}
