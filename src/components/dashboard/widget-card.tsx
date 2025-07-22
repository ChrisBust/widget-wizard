import { Building, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { IWidget } from '@/models/widget';
import DeleteWidgetButton from './delete-widget-button';
import EmbedCodeButton from './embed-code-button';
import PreviewWidgetDialog from './preview-widget-dialog';

interface WidgetCardProps {
  widget: IWidget;
}

export function WidgetCard({ widget }: WidgetCardProps) {
  const widgetData = JSON.parse(JSON.stringify(widget));
  
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{widgetData.businessName}</CardTitle>
          <CardDescription>{widgetData.website}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Building className="mr-1 h-3 w-3" />
            {widgetData.reviews.length} reviews
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Updated {formatDistanceToNow(new Date(widgetData.updatedAt), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
            <PreviewWidgetDialog widget={widgetData} />
            <EmbedCodeButton widgetId={widgetData._id} />
        </div>
        <DeleteWidgetButton widgetId={widgetData._id} />
      </CardFooter>
    </Card>
  );
}
