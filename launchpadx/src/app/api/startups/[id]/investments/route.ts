import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/models/Investment';
import Startup from '@/models/Startup';

interface StartupInvestmentsRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: StartupInvestmentsRouteContext) {
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

    const investments = await Investment.find({ startupId: id, status: 'completed' })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    const totalAmount = investments.reduce((sum, investment) => sum + investment.amount, 0);
    const totalEquity = investments.reduce((sum, investment) => sum + investment.equity, 0);

    return NextResponse.json({
      data: investments.map((investment) => {
        const investorName =
          typeof investment.userId === 'object' && 'name' in investment.userId
            ? investment.userId.name
            : 'Investor';

        return {
          _id: investment._id.toString(),
          investorName,
          amount: investment.amount,
          equity: investment.equity,
          status: investment.status,
          transactionId: investment.transactionId,
          createdAt: investment.createdAt,
        };
      }),
      summary: {
        count: investments.length,
        totalAmount,
        totalEquity,
      },
    });
  } catch (error) {
    console.error('Error fetching startup investments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startup investments' },
      { status: 500 }
    );
  }
}
