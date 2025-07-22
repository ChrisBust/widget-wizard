import Link from 'next/link';
import { PlusCircle, SlidersHorizontal } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import { Button } from '@/components/ui/button';
import DashboardClient from '@/components/dashboard/dashboard-client';

async function getWidgets() {
  await dbConnect();
  const widgets = await Widget.find({}).sort({ updatedAt: -1 });
  // A deep copy is needed to pass server-side data to client components.
  return JSON.parse(JSON.stringify(widgets));
}

export default async function DashboardPage() {
  const widgets = await getWidgets();

  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Widgets
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Create, manage, and embed your review widgets.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/dashboard/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Widget
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {widgets.length > 0 ? (
        <DashboardClient widgets={widgets} />
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-card">
              <h3 className="mt-2 text-xl font-semibold text-foreground">No widgets yet!</h3>
              <p className="mt-1 text-md text-muted-foreground">Get started by creating a new widget.</p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/dashboard/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Widget
                  </Link>
                </Button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
