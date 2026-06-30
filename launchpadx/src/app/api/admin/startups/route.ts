import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateStartupSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['draft', 'active', 'funded', 'closed']),
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startups = await Startup.find({}).sort({ createdAt: -1 });
    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = updateStartupSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid startup update' }, { status: 400 });
    }

    const { id, status } = parsed.data;

    const updatedStartup = await Startup.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedStartup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error('Error updating startup:', error);
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 });
  }
}
