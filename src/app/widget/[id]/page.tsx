import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import WidgetView from '@/components/widget/widget-view';
import { notFound } from 'next/navigation';

async function getWidget(id: string) {
  try {
    await dbConnect();
    const widget = await Widget.findById(id);
    if (!widget) {
      return null;
    }
    return JSON.parse(JSON.stringify(widget));
  } catch (error) {
    console.error("Failed to fetch widget:", error);
    return null;
  }
}

export default async function WidgetPage({ params }: { params: { id: string } }) {
  const widget = await getWidget(params.id);

  if (!widget) {
    notFound();
  }

  return <WidgetView widget={widget} />;
}
