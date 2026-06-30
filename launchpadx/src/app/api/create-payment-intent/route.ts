import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const paymentIntentSchema = z.object({
  startupId: z.string().min(1),
  amount: z.coerce.number().int().positive().max(1_000_000),
});

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-06-24.dahlia',
    });

    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = paymentIntentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
    }

    const { amount, startupId } = parsed.data;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    if (startup.status !== 'active') {
      return NextResponse.json({ error: 'This campaign is not accepting investments' }, { status: 400 });
    }

    if (amount < startup.minInvestment) {
      return NextResponse.json({ error: `Minimum investment is $${startup.minInvestment}` }, { status: 400 });
    }

    if (startup.amountRaised + amount > startup.fundingGoal) {
      return NextResponse.json({ error: 'Payment exceeds remaining campaign allocation' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        startupId: startupId,
        userId: user._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
