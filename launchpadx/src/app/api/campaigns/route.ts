import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(10),
  industry: z.string().min(2),
  location: z.string().min(2),
  fundingGoal: z.coerce.number().int().min(10_000),
  minInvestment: z.coerce.number().int().positive(),
  expectedEquity: z.coerce.number().positive().max(50),
  story: z.string().min(50),
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);

    if (!user || !['admin', 'founder'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = campaignSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid campaign data' }, { status: 400 });
    }

    const body = parsed.data;
    const startup = await Startup.create({
      name: body.name,
      tagline: body.tagline,
      description: body.story,
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200',
      industry: body.industry,
      location: body.location,
      founder: user.name,
      founderId: user._id,
      fundingGoal: body.fundingGoal,
      amountRaised: 0,
      minInvestment: body.minInvestment,
      expectedEquity: body.expectedEquity / 100,
      backers: 0,
      daysLeft: 30,
      status: 'draft',
    });

    return NextResponse.json({
      data: {
        reference: startup._id,
      },
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
