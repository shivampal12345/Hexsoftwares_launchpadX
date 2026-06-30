import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createStartupSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(10),
  description: z.string().min(20),
  coverImage: z.string().url(),
  logo: z.string().url(),
  industry: z.string().min(2),
  location: z.string().min(2),
  fundingGoal: z.coerce.number().int().min(10_000),
  minInvestment: z.coerce.number().int().positive(),
  expectedEquity: z.coerce.number().positive().max(1),
  daysLeft: z.coerce.number().int().positive().max(365),
  website: z.string().url().optional(),
  pitchDeck: z.string().url().optional(),
});

export async function GET() {
  try {
    await dbConnect();
    const startups = await Startup.find({ status: 'active' }).sort({ createdAt: -1 });
    return NextResponse.json({
      data: startups,
      count: startups.length,
    });
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startups' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user || !['admin', 'founder'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = createStartupSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid startup data' }, { status: 400 });
    }

    const startup = await Startup.create({
      ...parsed.data,
      founder: user.name,
      founderId: user._id,
      amountRaised: 0,
      backers: 0,
      status: 'draft',
    });

    return NextResponse.json(startup, { status: 201 });
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Failed to create startup' },
      { status: 500 }
    );
  }
}
