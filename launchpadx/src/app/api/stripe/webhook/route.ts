import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Investment from '@/models/Investment';
import Startup from '@/models/Startup';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-06-24.dahlia',
  });
}

async function recordCompletedCheckout(session: Stripe.Checkout.Session) {
  const startupId = session.metadata?.startupId;
  const userId = session.metadata?.userId;
  const metadataAmount = Number(session.metadata?.amount);
  const paidAmount = typeof session.amount_total === 'number' ? session.amount_total / 100 : metadataAmount;

  if (!startupId || !userId || !Number.isFinite(paidAmount) || paidAmount <= 0) {
    throw new Error('Checkout session is missing required investment metadata');
  }

  await dbConnect();

  const mongoSession = await mongoose.startSession();

  try {
    await mongoSession.withTransaction(async () => {
      const existingInvestment = await Investment.findOne({ transactionId: session.id }).session(mongoSession);
      if (existingInvestment) {
        return;
      }

      const startup = await Startup.findById(startupId).session(mongoSession);
      if (!startup) {
        throw new Error(`Startup ${startupId} was not found`);
      }

      if (startup.status !== 'active') {
        throw new Error(`Startup ${startupId} is not accepting investments`);
      }

      if (paidAmount < startup.minInvestment) {
        throw new Error(`Paid amount is below minimum investment for startup ${startupId}`);
      }

      if (startup.amountRaised + paidAmount > startup.fundingGoal) {
        throw new Error(`Paid amount exceeds remaining allocation for startup ${startupId}`);
      }

      const equity =
        startup.fundingGoal > 0
          ? (paidAmount / startup.fundingGoal) * (startup.expectedEquity * 100)
          : 0;

      await Investment.create(
        [
          {
            userId,
            startupId,
            amount: paidAmount,
            equity,
            status: 'completed',
            transactionId: session.id,
          },
        ],
        { session: mongoSession }
      );

      startup.amountRaised += paidAmount;
      startup.backers += 1;

      if (startup.amountRaised >= startup.fundingGoal) {
        startup.status = 'funded';
      }

      await startup.save({ session: mongoSession });
    });
  } finally {
    await mongoSession.endSession();
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook secret not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Stripe webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === 'paid') {
        await recordCompletedCheckout(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
