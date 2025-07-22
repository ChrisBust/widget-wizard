
'use client';

import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import WidgetView from '@/components/widget/widget-view';
import type { IWidget } from '@/models/widget';

export default function PreviewWidgetDialog({ widget }: { widget: IWidget }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Widget Preview</DialogTitle>
          <DialogDescription>
            This is how your widget will appear to users.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
           <WidgetView widget={widget} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
