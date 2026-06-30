import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';

export async function GET() {
  try {
    await dbConnect();

    const [draftCampaigns, awaitingReview, readyToLaunch] = await Promise.all([
      Startup.countDocuments({ status: 'draft' }),
      Startup.countDocuments({ status: 'draft' }),
      Startup.countDocuments({
        status: 'active',
        amountRaised: { $gt: 0 },
        $expr: { $lt: ['$amountRaised', { $multiply: ['$fundingGoal', 0.25] }] },
      }),
    ]);

    return NextResponse.json({
      data: {
        draftCampaigns,
        awaitingReview,
        readyToLaunch,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard summary' },
      { status: 500 }
    );
  }
}
