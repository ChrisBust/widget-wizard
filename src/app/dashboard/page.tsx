import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import { Button } from '@/components/ui/button';
import DashboardClient from '@/components/dashboard/dashboard-client';

async function getWidgets() {
  await dbConnect();
  const widgets = await Widget.find({}).sort({ updatedAt: -1 });
  return JSON.parse(JSON.stringify(widgets));
}

export default async function DashboardPage() {
  const widgets = await getWidgets();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">All-In-One Reviews</h1>
            <p className="text-muted-foreground">Manage your business review widgets.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Widget
          </Link>
        </Button>
      </div>

      {widgets.length > 0 ? (
        <DashboardClient widgets={widgets} />
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No widgets created</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new widget.</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Widget
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
