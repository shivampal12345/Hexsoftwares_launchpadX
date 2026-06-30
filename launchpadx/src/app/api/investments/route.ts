import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/models/Investment';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const investments = await Investment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate('startupId');
    return NextResponse.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Investments must be completed through Stripe Checkout.' },
      { status: 409 }
    );
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
  }
}
