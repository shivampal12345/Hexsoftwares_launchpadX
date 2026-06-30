import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/models/Investment';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const investments = await Investment.find({})
      .sort({ createdAt: -1 })
      .populate('startupId')
      .populate('userId');
    return NextResponse.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}
