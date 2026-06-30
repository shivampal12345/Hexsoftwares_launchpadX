import { notFound } from 'next/navigation';
import { StartupDetailPage } from '@/components/startups/StartupDetailPage';
import dbConnect from '@/lib/db';
import Startup from '@/models/Startup';

export const dynamic = 'force-dynamic';

interface StartupPageProps {
  params: Promise<{ id: string }>;
}

export default async function StartupPage({ params }: StartupPageProps) {
  const { id } = await params;
  
  await dbConnect();
  const startup = await Startup.findById(id);

  if (!startup) {
    notFound();
  }

  return (
    <StartupDetailPage 
      startupId={id} 
      initialStartup={{
        ...startup.toObject(),
        id: startup._id.toString(),
        _id: startup._id.toString(),
      }} 
    />
  );
}
