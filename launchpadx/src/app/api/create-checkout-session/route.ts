import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';

const checkoutSessionSchema = z.object({
  startupId: z.string().min(1),
  amount: z.coerce.number().int().positive().max(1_000_000),
  fullName: z.string().min(2).max(120),
});

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-06-24.dahlia',
  });
}

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = checkoutSessionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
    }

    const { amount, startupId, fullName } = parsed.data;
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

    const baseUrl = getBaseUrl(request);
    const stripe = getStripe();
    const amountInCents = amount * 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/startups/${startupId}?checkout=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountInCents,
            product_data: {
              name: `Investment allocation: ${startup.name}`,
              description: `${startup.industry} campaign allocation for ${fullName}`,
            },
          },
        },
      ],
      metadata: {
        startupId,
        userId: user._id.toString(),
        fullName,
        amount: amount.toString(),
      },
      payment_intent_data: {
        metadata: {
          startupId,
          userId: user._id.toString(),
          fullName,
          amount: amount.toString(),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
