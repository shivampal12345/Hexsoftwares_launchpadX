import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

interface StartupRouteContext {
  params: Promise<{ id: string }>;
}

const updateStartupSchema = z
  .object({
    name: z.string().min(2).optional(),
    tagline: z.string().min(10).optional(),
    description: z.string().min(20).optional(),
    coverImage: z.string().url().optional(),
    logo: z.string().url().optional(),
    industry: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    fundingGoal: z.coerce.number().int().min(10_000).optional(),
    minInvestment: z.coerce.number().int().positive().optional(),
    expectedEquity: z.coerce.number().positive().max(1).optional(),
    daysLeft: z.coerce.number().int().positive().max(365).optional(),
    website: z.string().url().optional(),
    pitchDeck: z.string().url().optional(),
    status: z.enum(['draft', 'active', 'funded', 'closed']).optional(),
  })
  .strict();

function canViewStartup(user: Awaited<ReturnType<typeof getCurrentUser>>, startup: {
  status?: string;
  founderId?: { toString: () => string };
}) {
  if (startup.status === 'active' || startup.status === 'funded') {
    return true;
  }

  if (!user) {
    return false;
  }

  return user.role === 'admin' || startup.founderId?.toString() === user._id.toString();
}

function canUpdateStartup(user: Awaited<ReturnType<typeof getCurrentUser>>, startup: {
  founderId?: { toString: () => string };
}) {
  if (!user) {
    return false;
  }

  return user.role === 'admin' || startup.founderId?.toString() === user._id.toString();
}

export async function GET(request: Request, context: StartupRouteContext) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const startup = await Startup.findById(id);
    
    if (!startup) {
      return NextResponse.json(
        { error: 'Startup campaign was not found.' },
        { status: 404 }
      );
    }

    const user = await getCurrentUser(request);

    if (!canViewStartup(user, startup)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ data: startup });
  } catch (error) {
    console.error('Error fetching startup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startup' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: StartupRouteContext) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingStartup = await Startup.findById(id);
    
    if (!existingStartup) {
      return NextResponse.json(
        { error: 'Startup campaign was not found.' },
        { status: 404 }
      );
    }

    if (!canUpdateStartup(user, existingStartup)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = updateStartupSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid startup update' }, { status: 400 });
    }

    if (parsed.data.status && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update campaign status' }, { status: 403 });
    }

    const startup = await Startup.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    
    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error updating startup:', error);
    return NextResponse.json(
      { error: 'Failed to update startup' },
      { status: 500 }
    );
  }
}
